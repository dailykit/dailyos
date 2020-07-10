import {
   ButtonTile,
   IconButton,
   Input,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui/'
import React, { useContext, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   UPDATE_SACHET_WORK_ORDER,
   CREATE_SACHET_WORK_ORDER,
   SACHET_WORK_ORDER_SUBSCRIPTION,
} from '../../../graphql'

import AddIcon from '../../../../../shared/assets/icons/Add'
import { ItemCard, Spacer, StatusSwitch } from '../../../components'
import FormHeading from '../../../components/FormHeading'
import {
   reducers,
   SachetOrderContext,
   state as initialState,
} from '../../../context/sachetOrder'
import { Context } from '../../../context/tabs'
import {
   FlexContainer,
   FormActions,
   StyledForm,
   StyledWrapper,
} from '../styled'
import SelectInputBulkItemTunnel from './Tunnels/SelectInputBulkItemTunnel'
import SelectLabelTemplateTunnel from './Tunnels/SelectLabelTemplateTunnel'
import SelectOutputSachetItemTunnel from './Tunnels/SelectOutputSachetItemTunnel'
import SelectPackagingTunnel from './Tunnels/SelectPackagingTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'

const address = 'apps.inventory.views.forms.sachetworkorder.'

export default function SachetWorkOrder() {
   const { t } = useTranslation()
   const { state } = useContext(Context)
   const [sachetOrderState, sachetOrderDispatch] = useReducer(
      reducers,
      initialState
   )

   const [status, setStatus] = useState(
      sachetOrderState.status || state.sachetWorkOrder?.status || ''
   )

   const [
      supplierItemTunnel,
      openSupplierItemTunnel,
      closeSupplierItemTunnel,
   ] = useTunnel(1)
   const [
      outputSachetItemTunnel,
      openOutputSachetItemTunnel,
      closeOutputSachetItemTunnel,
   ] = useTunnel(1)
   const [userTunnel, openUserTunnel, closeUserTunnel] = useTunnel(1)
   const [stationTunnel, openStationTunnel, closeStationTunnel] = useTunnel(1)
   const [
      inputBulkItemTunnel,
      openInputBulkItemTunnel,
      closeInputBulkItemTunnel,
   ] = useTunnel(1)
   const [
      packagingTunnel,
      openPackagingTunnel,
      closePackagingTunnel,
   ] = useTunnel(1)
   const [
      labelTemplateTunnel,
      openLabelTemplateTunnel,
      closeLabelTemplateTunnel,
   ] = useTunnel(1)

   const { data: sachetWorkOrderData, loading: orderLoading } = useSubscription(
      SACHET_WORK_ORDER_SUBSCRIPTION,
      {
         variables: { id: state.sachetWorkOrder?.id },
      }
   )

   const [createSachetWorkOrder, { loading }] = useMutation(
      CREATE_SACHET_WORK_ORDER,
      {
         onCompleted: data => {
            toast.success('Work Order created successfully!')

            sachetOrderDispatch({
               type: 'SET_META',
               payload: {
                  id: data.createSachetWorkOrder.returning[0].id,
                  status: data.createSachetWorkOrder.returning[0].status,
               },
            })
         },
         onError: error => {
            console.log(error)
            toast.error('Error! Please try again.')
         },
      }
   )
   const [updateSachetWorkOrder] = useMutation(UPDATE_SACHET_WORK_ORDER, {
      onCompleted: data => {
         toast.info('Work Order updated successfully!')
         sachetOrderDispatch({
            type: 'SET_META',
            payload: {
               id: data.updateSachetWorkOrder.returning[0].id,
               status: data.updateSachetWorkOrder.returning[0].status,
            },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again.')
      },
   })

   React.useEffect(() => {
      if (state.sachetWorkOrder?.id) {
         sachetOrderDispatch({
            type: 'SET_META',
            payload: {
               id: state.sachetWorkOrder?.id,
               status: state.sachetWorkOrder?.status,
            },
         })
      }
   }, [state.sachetWorkOrder?.id])

   const checkForm = () => {
      if (!sachetOrderState.supplierItem?.id) {
         toast.error('No Supplier Item selecetd!')
         return false
      }
      if (!sachetOrderState.inputItemProcessing?.id) {
         toast.error('No Input Bulk Item selecetd!')
         return false
      }
      if (!sachetOrderState.outputSachet?.id) {
         toast.error('No Output Bulk Item selecetd!')
         return false
      }

      if (!sachetOrderState.assignedDate) {
         toast.error("Can't publish unscheduled work order!")
         return false
      }

      return true
   }

   const saveStatus = async status => {
      updateSachetWorkOrder({
         variables: { id: sachetOrderState.id, status },
      })
   }

   const handlePublish = async () => {
      const isValid = checkForm()
      if (isValid) {
         createSachetWorkOrder({
            variables: {
               object: {
                  status: 'PENDING',
                  inputQuantity: sachetOrderState.inputQuantity,
                  packagingId: sachetOrderState.packaging.id,
                  label: sachetOrderState.labelTemplates,
                  inputBulkItemId: sachetOrderState.inputItemProcessing.id,
                  outputSachetItemId: sachetOrderState.outputSachet.id,
                  outputQuantity: sachetOrderState.sachetQuantity,
                  scheduledOn: sachetOrderState.assignedDate,
                  stationId: sachetOrderState.selectedStation.id,
                  userId: sachetOrderState.assignedUser.id,
               },
            },
         })
      }
   }

   if (orderLoading || loading) return <Loader />

   return (
      <SachetOrderContext.Provider
         value={{ sachetOrderState, sachetOrderDispatch }}
      >
         <Tunnels tunnels={supplierItemTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectSupplierItemTunnel close={closeSupplierItemTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={outputSachetItemTunnel}>
            <Tunnel layer={1}>
               <SelectOutputSachetItemTunnel
                  close={closeOutputSachetItemTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={userTunnel}>
            <Tunnel layer={1}>
               <SelectUserTunnel close={closeUserTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={stationTunnel}>
            <Tunnel layer={1}>
               <SelectStationTunnel close={closeStationTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={inputBulkItemTunnel}>
            <Tunnel layer={1}>
               <SelectInputBulkItemTunnel
                  close={closeInputBulkItemTunnel}
                  bulkItems={sachetOrderState.supplierItem?.bulkItems}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={packagingTunnel}>
            <Tunnel layer={1}>
               <SelectPackagingTunnel close={closePackagingTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={labelTemplateTunnel}>
            <Tunnel layer={1}>
               <SelectLabelTemplateTunnel close={closeLabelTemplateTunnel} />
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
                     {sachetOrderState.supplierItem?.title &&
                        `- ${sachetOrderState.supplierItem.title}`}
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
               {sachetOrderState.supplierItem?.name ||
               sachetWorkOrderData?.sachetWorkOrder?.bulkItem?.supplierItem
                  .name ? (
                  <>
                     {status ? (
                        <ItemCard
                           title={
                              sachetOrderState.supplierItem.name ||
                              sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                                 ?.supplierItem.name
                           }
                        />
                     ) : (
                        <ItemCard
                           title={
                              sachetOrderState.supplierItem.name ||
                              sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                                 ?.supplierItem.name
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

               {(sachetOrderState.supplierItem?.name ||
                  sachetWorkOrderData?.sachetWorkOrder?.bulkItem?.supplierItem
                     .name) && (
                  <>
                     <Text as="title">
                        {t(address.concat('input bulk item'))}
                     </Text>
                     {sachetOrderState.inputItemProcessing?.processingName ||
                     sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                        ?.processingName ? (
                        <>
                           {status ? (
                              <ItemCard
                                 title={
                                    sachetOrderState.inputItemProcessing
                                       .processingName ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.processingName
                                 }
                                 onHand={
                                    sachetOrderState.inputItemProcessing
                                       .onHand ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.onHand
                                 }
                                 shelfLife={
                                    sachetOrderState.inputItemProcessing
                                       .shelfLife?.value ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.shelfLife?.value
                                 }
                              />
                           ) : (
                              <ItemCard
                                 title={
                                    sachetOrderState.inputItemProcessing
                                       .processingName ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.processingName
                                 }
                                 onHand={
                                    sachetOrderState.inputItemProcessing
                                       .onHand ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.onHand
                                 }
                                 shelfLife={
                                    sachetOrderState.inputItemProcessing
                                       .shelfLife?.value ||
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.bulkItem?.shelfLife?.value
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

               {(sachetOrderState.inputItemProcessing?.id ||
                  sachetWorkOrderData?.sachetWorkOrder?.bulkItem?.id) && (
                  <>
                     <Text as="title">
                        {t(address.concat('output sachet item'))}
                     </Text>
                     {sachetOrderState.outputSachet?.unitSize ||
                     sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem
                        ?.unitSize ? (
                        <>
                           {status ? (
                              <ItemCard
                                 title={`${sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem.unitSize} ${sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem.unit}`}
                                 onHand={sachetOrderState.outputSachet.onHand}
                                 par={sachetOrderState.outputSachet.parLevel}
                              />
                           ) : (
                              <ItemCard
                                 title={`${sachetOrderState.outputSachet.unitSize} ${sachetOrderState.outputSachet.unit}`}
                                 onHand={
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.outputSachetItem.onHand
                                 }
                                 par={
                                    sachetWorkOrderData?.sachetWorkOrder
                                       ?.outputSachetItem.parLevel
                                 }
                                 edit={() => {
                                    openOutputSachetItemTunnel(1)
                                 }}
                              />
                           )}
                        </>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text={t(address.concat('select output sachet item'))}
                           onClick={() => {
                              openOutputSachetItemTunnel(1)
                           }}
                        />
                     )}
                  </>
               )}

               {sachetOrderState.outputSachet?.id && (
                  <Configurator
                     openPackagingTunnel={openPackagingTunnel}
                     openLabelTemplateTunnel={openLabelTemplateTunnel}
                     openUserTunnel={openUserTunnel}
                     openStationTunnel={openStationTunnel}
                  />
               )}
            </StyledForm>
         </StyledWrapper>
      </SachetOrderContext.Provider>
   )
}

function Configurator({
   openPackagingTunnel,
   openLabelTemplateTunnel,
   openUserTunnel,
   openStationTunnel,
}) {
   const { t } = useTranslation()
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )

   const [assignedDate, setAssignedDate] = useState('')

   return (
      <>
         <Spacer />

         <Text as="title">{t(address.concat('enter number of sachtes'))}</Text>
         <br />
         <FlexContainer
            style={{ width: '50%', justifyContent: 'space-between' }}
         >
            <FlexContainer style={{ width: '35%', alignItems: 'center' }}>
               <IconButton
                  disabled={sachetOrderState.sachetQuantity === 1}
                  onClick={() => {
                     sachetOrderDispatch({ type: 'REMOVE_SACHET_QUANTITY' })
                  }}
                  type="ghost"
               >
                  <span style={{ color: '#00a7e1', fontWeight: '600' }}>-</span>
               </IconButton>
               <span style={{ width: '10px' }} />
               <Text as="title">{sachetOrderState.sachetQuantity}</Text>
               <span style={{ width: '10px' }} />

               <IconButton
                  onClick={() => {
                     sachetOrderDispatch({
                        type: 'ADD_SACHET_QUANTITY',
                     })
                  }}
                  type="ghost"
               >
                  <AddIcon color="#00a7e1" />
               </IconButton>
            </FlexContainer>

            <div>
               {sachetOrderState.sachetQuantity && (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('suggested committed quantity'))}
                     </Text>
                     <Text as="title">
                        {sachetOrderState.sachetQuantity *
                           +sachetOrderState.outputSachet.unitSize}
                     </Text>
                  </>
               )}
            </div>
         </FlexContainer>

         <br />

         <Text as="title">{t(address.concat('packaging'))}</Text>

         <>
            {sachetOrderState.packaging?.name ? (
               <ItemCard
                  title={sachetOrderState.packaging.name}
                  edit={() => openPackagingTunnel(1)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select packaging'))}
                  onClick={() => openPackagingTunnel(1)}
               />
            )}
         </>

         <br />

         {sachetOrderState.packaging?.name && (
            <>
               <Text as="title">{t(address.concat('label template'))}</Text>
               <>
                  {sachetOrderState.labelTemplates[0]?.title ? (
                     <ItemCard
                        title={sachetOrderState.labelTemplates
                           .map(temp => `${temp.title}`)
                           .join(', ')}
                        edit={() => openLabelTemplateTunnel(1)}
                     />
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat('select label template'))}
                        onClick={() => openLabelTemplateTunnel(1)}
                     />
                  )}
               </>
            </>
         )}

         <br />

         <Text as="title">{t(address.concat('user assigned'))}</Text>

         <>
            {sachetOrderState.assignedUser?.name ? (
               <ItemCard
                  title={sachetOrderState.assignedUser.name}
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
               sachetOrderDispatch({
                  type: 'SET_ASSIGNED_DATE',
                  payload: assignedDate,
               })
            }}
         />

         <br />

         <>
            <Text as="title">{t(address.concat('station assigned'))}</Text>

            {sachetOrderState.selectedStation?.name ? (
               <ItemCard
                  title={sachetOrderState.selectedStation.name}
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
