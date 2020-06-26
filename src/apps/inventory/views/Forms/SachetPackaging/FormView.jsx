import React from 'react'
import { TextButton, Tunnels, Tunnel, useTunnel, Avatar } from '@dailykit/ui'

import {
   StyledHeader,
   StyledInfo,
   StyledSupplier,
   TransparentIconButton,
} from '../Item/styled'
import InfoBar from './InfoBar'
import PackagingStats from './PackagingStatus'
import EditIcon from '../../../../../shared/assets/icons/Edit'

import {
   ItemInformationTunnel,
   MoreItemInfoTunnel,
   SuppliersTunnel,
} from './Tunnels'

export default function FormView({ state }) {
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
                     <TransparentIconButton
                        onClick={() => openItemInfoTunnel(1)}
                     >
                        <EditIcon size="18" color="#555B6E" />
                     </TransparentIconButton>
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

   const TunnelContainer = (
      <Tunnels tunnels={suppliersTunnel}>
         <Tunnel layer={1} style={{ overflowY: 'auto' }}>
            <SuppliersTunnel close={closeSuppliersTunnel} state={state} />
         </Tunnel>
      </Tunnels>
   )

   if (state.supplier && state.supplier.name)
      return (
         <>
            {TunnelContainer}
            <StyledSupplier>
               <span>{state.supplier.name}</span>
               <Avatar
                  withName
                  title={`${state.supplier?.contactPerson?.firstName} ${
                     state.supplier?.contactPerson?.lastName || ''
                  }`}
               />
               <TransparentIconButton onClick={() => openSuppliersTunnel(1)}>
                  <EditIcon size="18" color="#555B6E" />
               </TransparentIconButton>
            </StyledSupplier>
         </>
      )

   return (
      <>
         {TunnelContainer}
         <TextButton onClick={() => openSuppliersTunnel(1)} type="outline">
            Add Supplier
         </TextButton>
      </>
   )
}
