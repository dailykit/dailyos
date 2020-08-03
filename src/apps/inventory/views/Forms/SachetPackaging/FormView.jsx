import React from 'react'
import {
   TextButton,
   Tunnels,
   Tunnel,
   useTunnel,
   Avatar,
   Input,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'

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
import { UPDATE_PACKAGING } from '../../../graphql'

// Props<{state: Packaging}>
export default function FormView({ state }) {
   const [itemInfoTunnel, openItemInfoTunnel, closeItemInfoTunnel] = useTunnel(
      2
   )
   const [itemName, setItemName] = React.useState(state.packagingName)

   const [updatePackaging] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         toast.info('Packaging name updated !')
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
      },
   })

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
            {state.packagingName && (
               <>
                  <StyledInfo>
                     <div style={{ marginRight: '10px' }}>
                        <Input
                           style={{ margin: '10px 0 5px' }}
                           type="text"
                           name="itemName"
                           value={itemName}
                           label="Packaging Name"
                           onChange={e => setItemName(e.target.value)}
                           onBlur={() => {
                              if (!itemName.length) {
                                 toast.error("Name can't be empty")
                                 return setItemName(state.name)
                              }

                              if (itemName !== state.name)
                                 updatePackaging({
                                    variables: {
                                       id: state.id,
                                       object: { packagingName: itemName },
                                    },
                                 })
                           }}
                        />
                        <span>sku: {state.packagingSku || 'N/A'}</span>
                     </div>
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

   const renderAvatar = contactPerson => {
      if (contactPerson && contactPerson.firstName)
         return (
            <Avatar
               withName
               title={`${state.supplier?.contactPerson?.firstName} ${
                  state.supplier?.contactPerson?.lastName || ''
               }`}
            />
         )
   }

   if (state.supplier && state.supplier.name)
      return (
         <>
            {TunnelContainer}
            <StyledSupplier>
               <span>{state.supplier.name}</span>
               {renderAvatar(state.supplier?.contactPerson)}
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
