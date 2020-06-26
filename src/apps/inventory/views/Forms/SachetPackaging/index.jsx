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
   const [
      suppliersTunnel,
      openSuppliersTunnel,
      closeSuppliersTunnel,
   ] = useTunnel(1)
   const [itemInfoTunnel, openItemInfoTunnel, closeItemInfoTunnel] = useTunnel(
      2
   )
   const [leakTunnel, openLeakTunnel, closeLeakTunnel] = useTunnel(1)
   const [opacityTunnel, openOpacityTunnel, closeOpacityTunnel] = useTunnel(1)
   const [
      compressibilityTunnel,
      openCompressibilityTunnel,
      closeCompressibilityTunnel,
   ] = useTunnel(1)
   const [
      packagingTypeTunnel,
      openPackagingTypeTunnel,
      closePackagingTypeTunnel,
   ] = useTunnel(1)
   const [
      sealingTypeTunnel,
      openSealingTypeTunnel,
      closeSealingTypeTunnel,
   ] = useTunnel(1)

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
            <Tunnels tunnels={suppliersTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <SuppliersTunnel
                     close={openSuppliersTunnel}
                     next={closeSuppliersTunnel}
                     suppliers={supplierData?.suppliers?.map(supplier => ({
                        id: supplier.id,
                        title: supplier.name,
                        description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.phoneNumber})`,
                     }))}
                     state={packaging}
                  />
               </Tunnel>
            </Tunnels>
            <Tunnels tunnels={itemInfoTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <ItemInformationTunnel
                     close={closeItemInfoTunnel}
                     next={openItemInfoTunnel}
                     state={packaging}
                  />
               </Tunnel>
               <Tunnel layer={2} style={{ overflowY: 'auto' }}>
                  <MoreItemInfoTunnel
                     close={closeItemInfoTunnel}
                     state={packaging}
                  />
               </Tunnel>
            </Tunnels>

            <Tunnels tunnels={leakTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <LeakResistanceTunnel
                     state={packaging}
                     close={closeLeakTunnel}
                  />
               </Tunnel>
            </Tunnels>

            <Tunnels tunnels={opacityTunnel}>
               <Tunnel style={{ overflowY: 'auto' }} layer={1}>
                  <OpacityTypeTunnel
                     state={packaging}
                     close={closeOpacityTunnel}
                  />
               </Tunnel>
            </Tunnels>

            <Tunnels tunnels={compressibilityTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <CompressibilityTunnel
                     state={packaging}
                     close={closeCompressibilityTunnel}
                  />
               </Tunnel>
            </Tunnels>

            <Tunnels tunnels={packagingTypeTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <PackagingTypeTunnel
                     state={packaging}
                     close={closePackagingTypeTunnel}
                  />
               </Tunnel>
            </Tunnels>

            <Tunnels tunnels={sealingTypeTunnel}>
               <Tunnel layer={1} style={{ overflowY: 'auto' }}>
                  <SealingTypeTunnel
                     state={packaging}
                     close={closeSealingTypeTunnel}
                  />
               </Tunnel>
            </Tunnels>

            <StyledWrapper>
               <FormView state={packaging} />
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}
