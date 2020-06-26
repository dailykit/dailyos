import React from 'react'
import {
   TextButton,
   IconButton,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { StyledHeader, StyledInfo, StyledSupplier } from '../Item/styled'
import InfoBar from './InfoBar'
import PackagingStats from './PackagingStatus'
import EditIcon from '../../../../../shared/assets/icons/Edit'

import { SUPPLIERS_SUBSCRIPTION } from '../../../graphql'

import {
   ItemInformationTunnel,
   MoreItemInfoTunnel,
   SuppliersTunnel,
} from './Tunnels'

export default function FormView({ state, open }) {
   const [itemInfoTunnel, openItemInfoTunnel, closeItemInfoTunnel] = useTunnel(
      2
   )

   return (
      <>
         <Tunnels tunnels={itemInfoTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <ItemInformationTunnel
                  close={closeItemInfoTunnel}
                  next={openItemInfoTunnel}
                  state={state}
               />
            </Tunnel>
            <Tunnel layer={2} style={{ overflowY: 'auto' }}>
               <MoreItemInfoTunnel close={closeItemInfoTunnel} state={state} />
            </Tunnel>
         </Tunnels>

         <StyledHeader>
            {state.name && (
               <>
                  <StyledInfo>
                     <div>
                        <h1>{state.name}</h1>
                        <span> {state.sku} </span>
                     </div>
                     <span style={{ width: '10px' }} />
                     <IconButton
                        type="outline"
                        onClick={() => openItemInfoTunnel(1)}
                     >
                        <EditIcon />
                     </IconButton>
                  </StyledInfo>
                  <SupplierInfo state={state} />
               </>
            )}
         </StyledHeader>

         <InfoBar open={openItemInfoTunnel} state={state} />
         <br />

         <PackagingStats state={state} />
      </>
   )
}

function SupplierInfo({ state }) {
   const [
      suppliersTunnel,
      openSuppliersTunnel,
      closeSuppliersTunnel,
   ] = useTunnel(1)

   const { data: supplierData } = useSubscription(SUPPLIERS_SUBSCRIPTION)

   const TunnelContainer = (
      <Tunnels tunnels={suppliersTunnel}>
         <Tunnel layer={1} style={{ overflowY: 'auto' }}>
            <SuppliersTunnel
               close={closeSuppliersTunnel}
               suppliers={supplierData?.suppliers?.map(supplier => ({
                  id: supplier.id,
                  title: supplier.name,
                  description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.phoneNumber})`,
               }))}
               state={state}
            />
         </Tunnel>
      </Tunnels>
   )

   if (state.supplier && state.supplier.name)
      return (
         <>
            {TunnelContainer}
            <StyledSupplier>
               <span>{state.supplier.name}</span>
               <span>
                  {(state.supplier.contactPerson?.phoneNumber &&
                     state.supplier.contactPerson?.firstName &&
                     state.supplier.contactPerson?.lastName &&
                     `${state.supplier.contactPerson.firstName} ${state.supplier.contactPerson.lastName} (${state.supplier.contactPerson.phoneNumber})`) ||
                     ''}
               </span>
               <IconButton
                  type="outline"
                  onClick={() => openSuppliersTunnel(1)}
               >
                  <EditIcon />
               </IconButton>
            </StyledSupplier>
         </>
      )

   return (
      <>
         {TunnelContainer}
         <TextButton onClick={() => openSuppliersTunnel(1)} type="outline">
            Select Supplier
         </TextButton>
      </>
   )
}
