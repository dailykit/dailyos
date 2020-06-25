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
import React, { useContext, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'
import {
   BulkOrderContext,
   reducers,
   state as initialState,
} from '../../../context/bulkOrder'
import { Context } from '../../../context/tabs'
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
   SUPPLIER_ITEMS_SUBSCRIPTION,
   SETTINGS_USERS_SUBSCRIPTION,
   STATIONS_SUBSCRIPTION,
   CREATE_BULK_WORK_ORDER,
   UPDATE_BULK_WORK_ORDER_STATUS,
   BULK_WORK_ORDER_SUBSCRIPTION,
} from '../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.'

export default function BulkWorkOrderForm() {
   const { t } = useTranslation()
   const [bulkOrderState, bulkOrderDispatch] = useReducer(
      reducers,
      initialState
   )
   const { state } = useContext(Context)

   const [status, setStatus] = useState(
      bulkOrderState.status || state.bulkWorkOrder.status || ''
   )

   const [loading, setLoading] = useState(false)

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

   const { data: stationsData, loading: stationsLoading } = useSubscription(
      STATIONS_SUBSCRIPTION
   )

   const { data: bulkWorkOrderData, loading: orderLoading } = useSubscription(
      BULK_WORK_ORDER_SUBSCRIPTION,
      {
         variables: { id: state.bulkWorkOrder.id },
      }
   )

   const [createBulkWorkOrder] = useMutation(CREATE_BULK_WORK_ORDER)
   const [updateBulkWorkOrderStatus] = useMutation(
      UPDATE_BULK_WORK_ORDER_STATUS
   )

   React.useEffect(() => {
      if (state.bulkWorkOrder?.id) {
         bulkOrderDispatch({
            type: 'SET_META',
            payload: {
               id: state.bulkWorkOrder.id,
               status: state.bulkWorkOrder.status,
            },
         })
      }
   }, [state.bulkWorkOrder.id])

   const checkForm = () => {
      if (!bulkOrderState.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (!bulkOrderState.inputItemProcessing?.id) {
         toast.error('No Input Bulk Item selecetd!')
         return false
      }
      if (!bulkOrderState.outputItemProcessing?.id) {
         toast.error('No Output Bulk Item selecetd!')
         return false
      }
      if (!bulkOrderState.outputItemProcessing.yield) {
         toast.error('Yield Percentage is not configured!')
         return false
      }
      if (!bulkOrderState.outputItemProcessing.outputQuantity) {
         toast.error('Output quantity is not configured!')
         return false
      }

      if (!bulkOrderState.assignedDate) {
         toast.error("Can't publish unscheduled work order!")
         return false
      }

      return true
   }

   const saveStatus = async status => {
      try {
         setLoading(true)
         const response = await updateBulkWorkOrderStatus({
            variables: { id: bulkOrderState.id, status },
         })

         if (response?.data) {
            setLoading(false)
            toast.info('Work Order updated successfully!')

            bulkOrderDispatch({
               type: 'SET_META',
               payload: {
                  id: response.data.updateBulkWorkOrder.returning[0].id,
                  status: response.data.updateBulkWorkOrder.returning[0].status,
               },
            })
         }
      } catch (error) {
         setLoading(false)
         toast.error('Errr! internal server error')
      }
   }

   const handlePublish = async () => {
      try {
         setLoading(true)
         const isValid = checkForm()

         if (isValid) {
            // create work order
            const response = await createBulkWorkOrder({
               variables: {
                  object: {
                     status: 'PENDING',
                     inputQuantity: bulkOrderState.inputQuantity,
                     inputQuantityUnit: bulkOrderState.inputItemProcessing.unit,
                     outputQuantity:
                        bulkOrderState.outputItemProcessing.outputQuantity,
                     inputBulkItemId: bulkOrderState.inputItemProcessing.id,
                     outputBulkItemId: bulkOrderState.outputItemProcessing.id,
                     userId: bulkOrderState.assignedUser.id,
                     stationId: bulkOrderState.selectedStation.id,
                     scheduledOn: bulkOrderState.assignedDate,
                  },
               },
            })

            if (response?.data) {
               setLoading(false)
               toast.success('Work Order created successfully!')
               setStatus(response.data.createBulkWorkOrder.returning[0].status)
               bulkOrderDispatch({
                  type: 'SET_META',
                  payload: {
                     id: response.data.createBulkWorkOrder.returning[0].id,
                     status:
                        response.data.createBulkWorkOrder.returning[0].status,
                  },
               })
            }
         } else {
            setLoading(false)
         }
      } catch (error) {
         setLoading(false)
         toast.error('Errr! internal server error')
      }
   }

   if (orderLoading || loading) return <Loader />

   return (
      <BulkOrderContext.Provider value={{ bulkOrderState, bulkOrderDispatch }}>
         <Tunnels tunnels={supplierItemTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectSupplierItemTunnel close={closeSupplierItemTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={outputBulkItemTunnel}>
            <Tunnel layer={1}>
               <SelectOutputBulkItemTunnel
                  close={closeOutputBulkItemTunnel}
                  bulkItems={bulkOrderState.supplierItem?.bulkItems}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={usersTunnels}>
            <Tunnel layer={1}>
               <SelectUserTunnel close={closeUserTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={stationsTunnel}>
            <Tunnel layer={1}>
               <SelectStationTunnel
                  close={closeStationTunnel}
                  stations={stationsData?.stations}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={inputBulkItemTunnel}>
            <Tunnel layer={1}>
               <SelectInputBulkItemTunnel
                  close={closeInputBulkItemTunnel}
                  bulkItems={bulkOrderState.supplierItem?.bulkItems}
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
                     {bulkOrderState.supplierItem?.name &&
                        `- ${bulkOrderState.supplierItem.name}`}
                  </Text>
               </div>

               <FormActions>
                  {status ? (
                     <StatusSwitch currentStatus={status} onSave={saveStatus} />
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
               {bulkOrderState.supplierItem?.name ||
               bulkWorkOrderData?.bulkWorkOrder?.outputBulkItem?.supplierItem
                  .name ? (
                  <>
                     {status ? (
                        <ItemCard
                           title={
                              bulkOrderState.supplierItem.name ||
                              bulkWorkOrderData.bulkWorkOrder.outputBulkItem
                                 .supplierItem.name
                           }
                        />
                     ) : (
                        <ItemCard
                           title={
                              bulkOrderState.supplierItem.name ||
                              bulkWorkOrderData.bulkWorkOrder.outputBulkItem
                                 .supplierItem.name
                           }
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

               {(bulkOrderState.supplierItem?.name ||
                  bulkWorkOrderData?.bulkWorkOrder?.outputBulkItem?.supplierItem
                     .name) && (
                  <>
                     <Text as="title">
                        {t(address.concat('input bulk item'))}
                     </Text>
                     {bulkOrderState.inputItemProcessing?.processingName ||
                     bulkWorkOrderData?.bulkWorkOrder?.inputBulkItem
                        .processingName ? (
                        <>
                           {status ? (
                              <ItemCard
                                 title={
                                    bulkOrderState.inputItemProcessing
                                       .processingName ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.processingName
                                 }
                                 onHand={
                                    bulkOrderState.inputItemProcessing.onHand ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.onHand
                                 }
                                 shelfLife={
                                    bulkOrderState.inputItemProcessing.shelfLife
                                       ?.value ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.shelfLife?.value
                                 }
                              />
                           ) : (
                              <ItemCard
                                 title={
                                    bulkOrderState.inputItemProcessing
                                       .processingName ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.processingName
                                 }
                                 onHand={
                                    bulkOrderState.inputItemProcessing.onHand ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.onHand
                                 }
                                 shelfLife={
                                    bulkOrderState.inputItemProcessing.shelfLife
                                       ?.value ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.inputBulkItem.shelfLife?.value
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
               )}

               <Spacer />

               {(bulkOrderState.supplierItem?.name ||
                  bulkWorkOrderData?.bulkWorkOrder?.outputBulkItem?.supplierItem
                     .name) && (
                  <>
                     <Text as="title">
                        {t(address.concat('output bulk item'))}
                     </Text>
                     {bulkOrderState.outputItemProcessing?.processingName ||
                     bulkWorkOrderData?.bulkWorkOrder?.outputBulkItem
                        ?.processingName ? (
                        <>
                           {status ? (
                              <ItemCard
                                 title={
                                    bulkOrderState.outputItemProcessing
                                       .processingName ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.processingName
                                 }
                                 onHand={
                                    bulkOrderState.outputItemProcessing
                                       .onHand ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.onHand
                                 }
                                 shelfLife={
                                    bulkOrderState.outputItemProcessing
                                       .shelfLife?.value ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.shelfLife?.value
                                 }
                              />
                           ) : (
                              <ItemCard
                                 title={
                                    bulkOrderState.outputItemProcessing
                                       .processingName ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.processingName
                                 }
                                 onHand={
                                    bulkOrderState.outputItemProcessing
                                       .onHand ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.onHand
                                 }
                                 shelfLife={
                                    bulkOrderState.outputItemProcessing
                                       .shelfLife?.value ||
                                    bulkWorkOrderData?.bulkWorkOrder
                                       ?.outputBulkItem?.shelfLife?.value
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
               )}

               {bulkOrderState.outputItemProcessing?.processingName && (
                  <Configurator
                     openUserTunnel={openUserTunnel}
                     openStationTunnel={openStationTunnel}
                     bulkWorkOrder={bulkWorkOrderData?.bulkWorkOrder}
                  />
               )}
            </StyledForm>
         </StyledWrapper>
      </BulkOrderContext.Provider>
   )
}

function Configurator({ openUserTunnel, openStationTunnel, bulkWorkOrder }) {
   const { t } = useTranslation()
   const { bulkOrderState, bulkOrderDispatch } = useContext(BulkOrderContext)
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkOrderState.outputItemProcessing.yield ||
         bulkWorkOrder?.outputBulkItem?.yield ||
         ''
   )
   const [outputQuantity, setOutputQuantity] = useState('')
   const [assignedDate, setAssignedDate] = useState(
      bulkWorkOrder?.scheduledOn || ''
   )

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
               placeholder={t(address.concat('yield percentage'))}
               name="yield"
               disabled={bulkWorkOrder?.outputBulkItem?.yield}
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
                        bulkOrderState.outputItemProcessing.yield || ''
                     )
                     return
                  }

                  bulkOrderDispatch({
                     type: 'SET_NEW_YIELD_PERCENT',
                     payload: parseInt(e.target.value),
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
                  placeholder={t(address.concat('enter output quantity'))}
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
                        setOutputQuantity('')
                        return
                     }

                     bulkOrderDispatch({
                        type: 'SET_OUTPUT_QUANTITY',
                        payload: parseInt(e.target.value),
                     })
                  }}
               />
            </div>

            <div>
               {bulkOrderState.outputItemProcessing.outputQuantity && (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('suggested committed quantity'))}
                     </Text>
                     <Text as="title">
                        {Math.round((outputQuantity * 100) / yieldPercentage)}
                     </Text>
                  </>
               )}
            </div>
         </FlexContainer>

         <br />

         <>
            {bulkOrderState.assignedUser?.name ||
            bulkWorkOrder?.user?.firstName ? (
               <ItemCard
                  title={
                     bulkOrderState.assignedUser.name ||
                     `${bulkWorkOrder?.user?.firstName} ${bulkWorkOrder?.user?.lastName}`
                  }
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
            placeholder={t(address.concat('date (mm/dd/yyyy)'))}
            onBlur={() => {
               bulkOrderDispatch({
                  type: 'SET_ASSIGNED_DATE',
                  payload: assignedDate,
               })
            }}
         />

         <br />

         <>
            <Text as="title">{t(address.concat('station assigned'))}</Text>

            {bulkOrderState.selectedStation?.name ||
            bulkWorkOrder?.station?.name ? (
               <ItemCard
                  title={
                     bulkOrderState.selectedStation.name ||
                     bulkWorkOrder?.station?.name
                  }
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
