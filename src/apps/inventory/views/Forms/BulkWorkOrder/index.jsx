import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   ButtonTile,
   Input,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui/'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'
import { Context as TabContext } from '../../../context/tabs'
import {
   FlexContainer,
   FormActions,
   StyledForm,
   StyledWrapper,
} from '../styled'
import SelectInputBulkItemTunnel from './Tunnels/SelectInputBulkItemTunnel'
import SelectOutputBulkItemTunnel from './Tunnels/SelectOutputBulkItemTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'

import {
   BULK_WORK_ORDER_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.'

function onError(error) {
   console.log(error)
   toast.error(error.message)
}

export default function BulkWorkOrderForm() {
   const { t } = useTranslation()

   const {
      state: {
         current: { id },
      },
   } = useContext(TabContext)

   const {
      data: { bulkWorkOrder: state = {} } = {},
      loading,
   } = useSubscription(BULK_WORK_ORDER_SUBSCRIPTION, {
      variables: { id },
      onError,
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError,
      onCompleted: () => {
         toast.success('Work Order updated!')
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
            <Tunnel layer={1}>
               <SelectOutputBulkItemTunnel
                  close={closeOutputBulkItemTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={usersTunnels}>
            <Tunnel layer={1}>
               <SelectUserTunnel close={closeUserTunnel} state={state} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={stationsTunnel}>
            <Tunnel layer={1}>
               <SelectStationTunnel close={closeStationTunnel} state={state} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={inputBulkItemTunnel}>
            <Tunnel layer={1}>
               <SelectInputBulkItemTunnel
                  close={closeInputBulkItemTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>

         <StyledWrapper>
            <FormHeading>
               <div
                  style={{
                     width: '30%',
                  }}
               >
                  <Text as="h1">
                     {t(address.concat('work order'))}{' '}
                     {state.supplierItem?.name
                        ? `- ${state.supplierItem.name}`
                        : null}
                  </Text>
               </div>

               <FormActions style={{ position: 'relative' }}>
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
               </FormActions>
            </FormHeading>

            <StyledForm style={{ padding: '0px 60px' }}>
               <Text as="title">
                  {t(address.concat('select supplier item'))}
               </Text>
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
                     <Text as="title">
                        {t(address.concat('input bulk item'))}
                     </Text>
                     {state.inputBulkItem?.processingName ? (
                        <>
                           {state.isPublished ? (
                              <ItemCard
                                 title={state.inputBulkItem.processingName}
                                 onHand={state.inputBulkItem.onHand}
                                 shelfLife={
                                    state.inputBulkItem.shelfLife?.value
                                 }
                              />
                           ) : (
                              <ItemCard
                                 title={state.inputBulkItem.processingName}
                                 onHand={state.inputBulkItem.onHand}
                                 shelfLife={
                                    state.inputBulkItem.shelfLife?.value
                                 }
                                 edit={() => openInputBulkItemTunnel(1)}
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

               <Spacer />

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
                                 shelfLife={
                                    state.outputBulkItem.shelfLife?.value
                                 }
                              />
                           ) : (
                              <ItemCard
                                 title={state.outputBulkItem.processingName}
                                 onHand={state.outputBulkItem.onHand}
                                 shelfLife={
                                    state.outputBulkItem.shelfLife?.value
                                 }
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
            </StyledForm>
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

   return (
      <>
         <Spacer />
         <div
            style={{
               width: '20%',
               display: 'flex',
               alignItems: 'flex-end',
            }}
         >
            <Input
               type="number"
               label={t(address.concat('yield percentage'))}
               name="yield"
               disabled={bulkWorkOrder.outputBulkItem.yield?.value}
               value={yieldPercentage}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value.length === 0) setYieldPercentage('')
                  if (value) {
                     setYieldPercentage(value)
                  }
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
            %
         </div>
         <br />
         <FlexContainer
            style={{ width: '50%', justifyContent: 'space-between' }}
         >
            <div style={{ width: '45%' }}>
               <Input
                  type="number"
                  label={t(address.concat('enter output quantity'))}
                  name="output"
                  value={outputQuantity}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setOutputQuantity('')
                     if (value) {
                        setOutputQuantity(e.target.value)
                     }
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
                              },
                           },
                        })
                     }
                  }}
               />
            </div>

            <div>
               {bulkWorkOrder.outputQuantity ? (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('suggested committed quantity'))}
                     </Text>
                     <Text as="title">
                        {Math.round((outputQuantity * 100) / yieldPercentage)}
                     </Text>
                  </>
               ) : null}
            </div>
         </FlexContainer>

         <br />

         <>
            {bulkWorkOrder.user?.firstName ? (
               <ItemCard
                  title={`${bulkWorkOrder.user.firstName} ${
                     bulkWorkOrder.user?.lastName || ''
                  }`}
                  edit={() => openUserTunnel(1)}
               />
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
         <br />

         <Text as="title">{t(address.concat('scheduled on'))}</Text>
         <br />

         <Input
            style={{
               border: 0,
               borderBottom: '1px solid rgba(0,0,0,0.2)',
               color: '#555b6e',
               padding: '5px',
            }}
            value={assignedDate}
            onChange={e => {
               setAssignedDate(e.target.value)
            }}
            type="datetime-local"
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
