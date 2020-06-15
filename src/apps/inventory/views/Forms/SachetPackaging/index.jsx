import React, { useReducer, useContext } from 'react'
import { useSubscription } from '@apollo/react-hooks'
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
   PackagingTypeTunnel,
   CompressibilityTunnel,
   SealingTypeTunnel,
} from './Tunnels'
import FormView from './FormView'

import {
   SUPPLIERS_SUBSCRIPTION,
   PACKAGING_SUBSCRIPTION,
} from '../../../graphql'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(6)
   const { loading: supplierLoading, data: supplierData } = useSubscription(
      SUPPLIERS_SUBSCRIPTION
   )

   const { loading, data: { packaging = {} } = {} } = useSubscription(
      PACKAGING_SUBSCRIPTION,
      {
         variables: { id },
      }
   )

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
                        description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.phoneNumber})`,
                     }))}
                     state={packaging}
                  />
               </Tunnel>
               <Tunnel layer={2}>
                  <ItemInformationTunnel
                     close={closeTunnel}
                     next={openTunnel}
                     state={packaging}
                  />
               </Tunnel>
               <Tunnel layer={3}>
                  <MoreItemInfoTunnel close={closeTunnel} state={packaging} />
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
               <Tunnel layer={7}>
                  <PackagingTypeTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={8}>
                  <SealingTypeTunnel close={closeTunnel} />
               </Tunnel>
            </Tunnels>

            <StyledWrapper>
               {packaging.id ? (
                  <FormView state={packaging} open={openTunnel} />
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
