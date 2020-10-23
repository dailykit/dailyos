import { useMutation } from '@apollo/react-hooks'
import {
   Avatar,
   Flex,
   Form,
   IconButton,
   Spacer,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import EditIcon from '../../../../../shared/assets/icons/Edit'
import { logger } from '../../../../../shared/utils'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { useTabs } from '../../../context'
import { UPDATE_PACKAGING } from '../../../graphql'
import { StyledSupplier } from '../Item/styled'
import InfoBar from './InfoBar'
import PackagingStats from './PackagingStatus'
import {
   ItemInformationTunnel,
   MoreItemInfoTunnel,
   SuppliersTunnel,
} from './Tunnels'

export default function FormView({ state }) {
   const { setTabTitle } = useTabs()
   const [itemInfoTunnel, openItemInfoTunnel, closeItemInfoTunnel] = useTunnel(
      2
   )
   const [itemName, setItemName] = React.useState(state.packagingName)

   const [updatePackaging] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         toast.info('Packaging name updated !')
         setTabTitle(itemName)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
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

         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            padding="16px 0"
         >
            {state.packagingName && (
               <>
                  <Flex>
                     <Form.Group>
                        <Form.Label htmlFor="itemName" title="itemName">
                           Packaging Name
                        </Form.Label>
                     </Form.Group>
                     <Form.Text
                        id="itemName"
                        name="itemName"
                        placeholder="Packaging Name"
                        value={itemName}
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
                                    object: { name: itemName },
                                 },
                              })
                        }}
                     />
                     <Text as="subtitle">
                        sku: {state.packagingSku || 'N/A'}
                     </Text>
                  </Flex>
                  <SupplierInfo state={state} />
               </>
            )}
         </Flex>

         <InfoBar open={openItemInfoTunnel} state={state} />
         <Spacer size="16px" />

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
            Add Supplier
         </TextButton>
      </>
   )
}
