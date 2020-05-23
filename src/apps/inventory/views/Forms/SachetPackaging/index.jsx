import React, { useReducer, useState, useContext } from 'react'
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
   LeakResistanceTunnel,
   OpacityTypeTunnel,
   CompressibilityTunnel,
} from './Tunnels'
import FormView from './FormView'

import { SUPPLIERS, PACKAGING_SUBSCRIPTION } from '../../../graphql'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const { state } = useContext(Context)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(6)
   const [formState, setFormState] = useState({})
   const { loading: supplierLoading, data: supplierData } = useQuery(SUPPLIERS)

   const { loading } = useSubscription(PACKAGING_SUBSCRIPTION, {
      variables: { id: sachetPackagingState.id },
      onSubscriptionData: async input => {
         const data = input.subscriptionData.data.packaging
         sachetPackagingDispatch({
            type: 'ADD_ITEM_INFO',
            payload: {
               itemName: data.name,
               itemSku: data.sku,
               itemWidth: data.dimensions.width,
               itemHeight: data.dimensions.height,
               itemDepth: data.dimensions.depth,
               itemPar: data.parLevel,
               itemMaxValue: data.maxLevel,
               unitPrice: data.unitPrice,
               caseQuantity: data.caseQuantity,
               minOrderValue: data.minOrderValue,
               leadTime: data.leadTime.value,
               leadTimeUnit: data.leadTime.unit,
               unitQuantity: data.unitQuantity,
            },
         })
         setFormState(data)
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
               <Tunnel layer={4}>
                  <LeakResistanceTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel style={{ overflowY: 'auto' }} layer={5}>
                  <OpacityTypeTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={6}>
                  <CompressibilityTunnel close={closeTunnel} />
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
