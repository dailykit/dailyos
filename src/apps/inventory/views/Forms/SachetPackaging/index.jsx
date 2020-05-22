import React, { useReducer, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Tunnels, Tunnel, useTunnel, ButtonTile, Loader } from '@dailykit/ui'

import {
   sachetPackagingInitialState,
   sachetPackagingReducers,
   SachetPackagingContext,
} from '../../../context'
import { Context } from '../../../context/tabs'

import { StyledWrapper } from '../styled'
import {
   SuppliersTunnel,
   ItemInformationTunnel,
   MoreItemInfoTunnel,
} from './Tunnels'

import {
   StyledHeader,
   StyledInfo,
   StyledSupplier,
   StyledGrid,
} from '../Item/styled'

import { SUPPLIERS, PACKAGING_SUBSCRIPTION } from '../../../graphql'
import { ItemIcon, CaseIcon, TruckIcon, ClockIcon } from '../../../assets/icons'

const address = 'apps.inventory.views.forms.item.'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const { state } = useContext(Context)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(3)
   const [formState, setFormState] = useState({})
   const { loading: supplierLoading, data: supplierData } = useQuery(SUPPLIERS)

   const { loading } = useSubscription(PACKAGING_SUBSCRIPTION, {
      variables: { id: sachetPackagingState.id },
      onSubscriptionData: async data => {
         setFormState(data.subscriptionData.data.packaging)
      },
   })

   React.useEffect(() => {
      if (state.packagingId) {
         sachetPackagingDispatch({ type: 'ADD_ID', payload: state.packagingId })
      }
   }, [state.packagingId])

   if (supplierLoading || loading) return <Loader />

   return (
      <>
         <SachetPackagingContext.Provider
            value={{ sachetPackagingState, sachetPackagingDispatch }}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <SuppliersTunnel
                     close={closeTunnel}
                     next={openTunnel}
                     suppliers={supplierData?.suppliers?.map(supplier => ({
                        id: supplier.id,
                        title: supplier.name,
                        description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
                     }))}
                     rawSuppliers={supplierData.suppliers}
                  />
               </Tunnel>
               <Tunnel layer={2}>
                  <ItemInformationTunnel
                     close={closeTunnel}
                     next={openTunnel}
                  />
               </Tunnel>
               <Tunnel layer={3}>
                  <MoreItemInfoTunnel close={closeTunnel} />
               </Tunnel>
            </Tunnels>

            <StyledWrapper>
               {formState.id ? (
                  <FormView state={formState} open={openTunnel} />
               ) : (
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text="Select Supplier"
                     onClick={() => openTunnel(1)}
                     style={{ margin: '20px 0' }}
                  />
               )}
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}

function FormView({ state, open }) {
   const { t } = useTranslation()
   return (
      <>
         <StyledHeader>
            {state.name && (
               <>
                  <StyledInfo>
                     <h1>{state.title || state.name}</h1>
                     <span> {state.sku} </span>
                  </StyledInfo>
                  <StyledSupplier>
                     <span>{state.supplier?.name}</span>
                     <span>
                        {`${state.supplier.contactPerson.firstName} ${state.supplier.contactPerson.lastName} (${state.supplier.contactPerson?.countryCode} ${state.supplier.contactPerson?.phoneNumber})` ||
                           ''}
                     </span>
                  </StyledSupplier>
               </>
            )}
         </StyledHeader>
         <StyledGrid onClick={() => open(2)}>
            <div>
               <div>
                  <ItemIcon />
               </div>
               <div>
                  <span>{t(address.concat('unit qty'))}</span>
                  <div>
                     <span>{state.unitQuantity}</span>
                     <span>${state.unitPrice}</span>
                  </div>
               </div>
            </div>
            <div>
               <div>
                  <CaseIcon />
               </div>
               <div>
                  <span>{t(address.concat('case qty'))}</span>
                  <div>
                     <span>{state.caseQuantity}</span>
                     <span>${+state.unitPrice * +state.caseQuantity}</span>
                  </div>
               </div>
            </div>
            <div>
               <div>
                  <TruckIcon />
               </div>
               <div>
                  <span>{t(address.concat('min order value'))}</span>
                  <div>
                     <span>{state.minOrderValue}</span>
                     <span>${+state.unitPrice * +state.minOrderValue}</span>
                  </div>
               </div>
            </div>
            <div>
               <div>
                  <ClockIcon />
               </div>
               <div>
                  <span>{t(address.concat('lead time'))}</span>
                  <div>
                     <span>{state.leadTime?.value + state.leadTime?.unit}</span>
                  </div>
               </div>
            </div>
         </StyledGrid>
      </>
   )
}
