import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Avatar,
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Input,
   Loader,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EditIcon } from '../../../../../shared/assets/icons'
import { logger } from '../../../../../shared/utils'
import { ItemCard, Separator, StatusSwitch } from '../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { WORK_ORDER_UPDATED } from '../../../constants/successMessages'
import {
   BULK_WORK_ORDER_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../graphql'
import { StyledHeader } from '../../Listings/styled'
import { StyledWrapper } from '../styled'
import SelectInputBulkItemTunnel from './Tunnels/SelectInputBulkItemTunnel'
import SelectOutputBulkItemTunnel from './Tunnels/SelectOutputBulkItemTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'

const address = 'apps.inventory.views.forms.bulkworkorder.'

function onError(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
}

export default function BulkWorkOrderForm() {
   const { t } = useTranslation()
   const { id } = useParams()

   const {
      data: { bulkWorkOrder: state = {} } = {},
      loading,
      error,
   } = useSubscription(BULK_WORK_ORDER_SUBSCRIPTION, {
      variables: { id },
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError,
      onCompleted: () => {
         toast.success(WORK_ORDER_UPDATED)
      },
   })

   // Tunnels
   const [
      supplierItemTunnel,
      openSupplierItemTunnel,
      closeSupplierItemTunnel,
   ] = useTunnel(1)
   const [
      outputBulkItemTunnel,
      openOutputBulkItemTunnel,
      closeOutputBulkItemTunnel,
   ] = useTunnel(1)
   const [usersTunnels, openUserTunnel, closeUserTunnel] = useTunnel(1)
   const [stationsTunnel, openStationTunnel, closeStationTunnel] = useTunnel(1)
   const [
      inputBulkItemTunnel,
      openInputBulkItemTunnel,
      closeInputBulkItemTunnel,
   ] = useTunnel(1)

   if (error) {
      onError(error)
      return
   }

   const checkForm = () => {
      if (!state.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (!state.inputBulkItem?.id) {
         toast.error('No Input Bulk Item selecetd!')
         return false
      }
      if (!state.outputBulkItem?.id) {
         toast.error('No Output Bulk Item selecetd!')
         return false
      }
      if (!state.outputBulkItem.yield?.value) {
         if (!state.outputYield) {
            toast.error('Yield Percentage is not configured!')
            return false
         }
      }
      if (!state.outputQuantity) {
         toast.error('Output quantity is not configured!')
         return false
      }

      if (!state.scheduledOn) {
         toast.error("Unscheduled work order can't be published!")
         return false
      }

      return true
   }

   const handlePublish = () => {
      const isValid = checkForm()

      if (isValid) {
         updateBulkWorkOrder({
            variables: {
               id: state.id,
               object: {
                  isPublished: true,
                  status: 'PENDING',
               },
            },
         })
      }
   }

   const updateStatus = status => {
      updateBulkWorkOrder({
         variables: {
            id: state.id,
            object: {
               status,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={supplierItemTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectSupplierItemTunnel
                  close={closeSupplierItemTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={outputBulkItemTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectOutputBulkItemTunnel
                  close={closeOutputBulkItemTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={usersTunnels}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectUserTunnel close={closeUserTunnel} state={state} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={stationsTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectStationTunnel close={closeStationTunnel} state={state} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={inputBulkItemTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectInputBulkItemTunnel
                  close={closeInputBulkItemTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>

         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">
                  {t(address.concat('work order'))}{' '}
                  {state.supplierItem?.name
                     ? `- ${state.supplierItem.name}`
                     : null}
               </Text>

               {state.isPublished ? (
                  <StatusSwitch
                     currentStatus={state.status}
                     onSave={updateStatus}
                  />
               ) : (
                  <TextButton onClick={handlePublish} type="solid">
                     {t(address.concat('publish'))}
                  </TextButton>
               )}
            </StyledHeader>

            <Text as="title">{t(address.concat('select supplier item'))}</Text>
            {state.supplierItem?.name ? (
               <>
                  {state.isPublished ? (
                     <ItemCard title={state.supplierItem.name} />
                  ) : (
                     <ItemCard
                        title={state.supplierItem.name}
                        edit={() => openSupplierItemTunnel(1)}
                     />
                  )}
               </>
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select supplier item'))}
                  onClick={() => openSupplierItemTunnel(1)}
               />
            )}

            <br />

            {state.supplierItem?.name ? (
               <>
                  <Text as="title">{t(address.concat('input bulk item'))}</Text>
                  {state.inputBulkItem?.processingName ? (
                     <>
                        {state.isPublished ? (
                           <ItemCard
                              title={state.inputBulkItem.processingName}
                              onHand={state.inputBulkItem.onHand}
                              shelfLife={state.inputBulkItem.shelfLife?.value}
                              isBulk
                           />
                        ) : (
                           <ItemCard
                              title={state.inputBulkItem.processingName}
                              onHand={state.inputBulkItem.onHand}
                              shelfLife={state.inputBulkItem.shelfLife?.value}
                              edit={() => openInputBulkItemTunnel(1)}
                              isBulk
                           />
                        )}
                     </>
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat('select input bulk item'))}
                        onClick={() => openInputBulkItemTunnel(1)}
                     />
                  )}
               </>
            ) : null}

            <br />

            {state.supplierItem?.name ? (
               <>
                  <Text as="title">
                     {t(address.concat('output bulk item'))}
                  </Text>
                  {state.outputBulkItem?.processingName ? (
                     <>
                        {state.isPublished ? (
                           <ItemCard
                              title={state.outputBulkItem.processingName}
                              onHand={state.outputBulkItem.onHand}
                              isBulk
                              shelfLife={state.outputBulkItem.shelfLife?.value}
                           />
                        ) : (
                           <ItemCard
                              title={state.outputBulkItem.processingName}
                              onHand={state.outputBulkItem.onHand}
                              shelfLife={state.outputBulkItem.shelfLife?.value}
                              isBulk
                              edit={() => openOutputBulkItemTunnel(1)}
                           />
                        )}
                     </>
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat('select output bulk item'))}
                        onClick={() => openOutputBulkItemTunnel(1)}
                     />
                  )}
               </>
            ) : null}

            {state.outputBulkItem?.processingName ? (
               <Configurator
                  openUserTunnel={openUserTunnel}
                  openStationTunnel={openStationTunnel}
                  bulkWorkOrder={state}
               />
            ) : null}
         </StyledWrapper>
      </>
   )
}

function Configurator({ openUserTunnel, openStationTunnel, bulkWorkOrder }) {
   const { t } = useTranslation()
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkWorkOrder.outputBulkItem.yield?.value ||
         bulkWorkOrder.outputYield ||
         ''
   )
   const [outputQuantity, setOutputQuantity] = useState(
      bulkWorkOrder.outputQuantity
   )
   const [assignedDate, setAssignedDate] = useState(
      bulkWorkOrder.scheduledOn || ''
   )

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError,
      onCompleted: () => {
         toast.success('Information added.')
      },
   })

   const inputQuantity = Math.round((outputQuantity * 100) / yieldPercentage)

   return (
      <>
         <Separator />
         <Flex width="10rem">
            <Form.Group>
               <Form.Label htmlFor="yield" title="yield">
                  {t(address.concat('yield percentage'))}
               </Form.Label>

               <Form.Number
                  name="yield"
                  id="yield"
                  disabled={bulkWorkOrder.outputBulkItem.yield?.value}
                  value={yieldPercentage}
                  placeholder={t(address.concat('yield percentage'))}
                  onChange={e => {
                     setYieldPercentage(e.target.value)
                  }}
                  onBlur={e => {
                     if (e.target.value.length === 0) {
                        setYieldPercentage(
                           bulkWorkOrder.outputBulkItem?.yield || ''
                        )
                     }

                     updateBulkWorkOrder({
                        variables: {
                           id: bulkWorkOrder.id,
                           object: {
                              outputYield: +e.target.value,
                           },
                        },
                     })
                  }}
               />
            </Form.Group>
         </Flex>
         <br />
         <Flex container alignItems="center">
            <Form.Group>
               <Form.Label title="output quantity" htmlFor="output">
                  {t(address.concat('enter output quantity'))}
               </Form.Label>

               <Input
                  id="output"
                  name="output"
                  value={outputQuantity}
                  onChange={e => {
                     if (e.target.value.length === 0) setOutputQuantity('')
                     setOutputQuantity(e.target.value)
                  }}
                  onBlur={e => {
                     if (e.target.value.length === 0) {
                        setOutputQuantity(bulkWorkOrder.outputQuantity)
                     } else {
                        updateBulkWorkOrder({
                           variables: {
                              id: bulkWorkOrder.id,
                              object: {
                                 outputQuantity: +e.target.value,
                                 inputQuantity,
                              },
                           },
                        })
                     }
                  }}
               />
            </Form.Group>

            <span style={{ width: '16px' }} />

            <div>
               {bulkWorkOrder.outputQuantity ? (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('suggested committed quantity'))}
                     </Text>
                     <Text as="title">{inputQuantity}</Text>
                  </>
               ) : null}
            </div>
         </Flex>

         <br />
         <Text as="title">User Assigned</Text>

         <>
            {bulkWorkOrder.user?.firstName ? (
               <Flex
                  container
                  margin="16px 0 16px 0"
                  justifyContent="space-between"
               >
                  <Avatar
                     withName
                     title={`${bulkWorkOrder.user?.firstName} ${
                        bulkWorkOrder.user?.lastName || ''
                     }`}
                  />
                  <IconButton onClick={() => openUserTunnel(1)} type="outline">
                     <EditIcon />
                  </IconButton>
               </Flex>
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select and assign user to work'))}
                  onClick={() => openUserTunnel(1)}
               />
            )}
         </>

         <br />
         <Flex container>
            <Form.Group>
               <Form.Label htmlFor="scheduledDate" title="scheduledDate">
                  {t(address.concat('scheduled on'))}
               </Form.Label>
               <Form.Date
                  id="scheduledDate"
                  name="scheduledDate"
                  value={assignedDate}
                  onChange={e => {
                     setAssignedDate(e.target.value)
                  }}
                  onBlur={e => {
                     updateBulkWorkOrder({
                        variables: {
                           id: bulkWorkOrder.id,
                           object: {
                              scheduledOn: e.target.value,
                           },
                        },
                     })
                  }}
               />
            </Form.Group>
         </Flex>

         <br />

         <>
            <Text as="title">{t(address.concat('station assigned'))}</Text>

            {bulkWorkOrder.station?.name ? (
               <ItemCard
                  title={bulkWorkOrder.station.name}
                  edit={() => openStationTunnel(1)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(
                     address.concat('select and assign station to route to')
                  )}
                  onClick={() => openStationTunnel(1)}
               />
            )}
         </>
         <br />
      </>
   )
}
