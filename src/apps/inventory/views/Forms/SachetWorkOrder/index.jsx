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
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
   SUPPLIER_ITEMS,
   SETTINGS_USERS,
   STATIONS,
   SACHET_ITEMS,
   PACKAGINGS,
   UPDATE_SACHET_WORK_ORDER,
   CREATE_SACHET_WORK_ORDER,
   SACHET_WORK_ORDER,
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

   const [tunnels, openTunnel, closeTunnel] = useTunnel(7)

   const { data: supplierItemData, loading: supplierItemLoading } = useQuery(
      SUPPLIER_ITEMS
   )
   const { data: userData, loading: userLoading } = useQuery(SETTINGS_USERS)
   const { data: stationsData, loading: stationsLoading } = useQuery(STATIONS)
   const { data: packagingData, loading: packagingsLoading } = useQuery(
      PACKAGINGS
   )
   const { data: sachetItemsData, loading: sachetItemLoading } = useQuery(
      SACHET_ITEMS,
      {
         variables: { bulkItemId: sachetOrderState.inputItemProcessing?.id },
      }
   )

   const { data: sachetWorkOrderData, loading: orderLoading } = useQuery(
      SACHET_WORK_ORDER,
      {
         variables: { id: state.sachetWorkOrder?.id },
      }
   )

   const [createSachetWorkOrder] = useMutation(CREATE_SACHET_WORK_ORDER)
   const [updateSachetWorkOrder] = useMutation(UPDATE_SACHET_WORK_ORDER)

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
      const response = await updateSachetWorkOrder({
         variables: { id: sachetOrderState.id, status },
      })
      if (response?.data) {
         toast.info('Work Order updated successfully!')
         sachetOrderDispatch({
            type: 'SET_META',
            payload: {
               id: response.data.updateSachetWorkOrder.returning[0].id,
               status: response.data.updateSachetWorkOrder.returning[0].status,
            },
         })
      }
   }

   const handlePublish = async () => {
      const isValid = checkForm()
      if (isValid) {
         const response = await createSachetWorkOrder({
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
         if (response?.data) {
            toast.success('Work Order created successfully!')
            setStatus(response.data.createSachetWorkOrder.returning[0].status)
            sachetOrderDispatch({
               type: 'SET_META',
               payload: {
                  id: response.data.createSachetWorkOrder.returning[0].id,
                  status:
                     response.data.createSachetWorkOrder.returning[0].status,
               },
            })
         }
      }
   }

   if (supplierItemLoading) return <Loader />
   if (orderLoading) return <Loader />

   if (
      sachetOrderState.outputSachet?.processingName &&
      (userLoading || stationsLoading || packagingsLoading || sachetItemLoading)
   ) {
      return <Loader />
   }

   return (
      <SachetOrderContext.Provider
         value={{ sachetOrderState, sachetOrderDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectSupplierItemTunnel
                  supplierItems={supplierItemData?.supplierItems}
                  close={closeTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <SelectOutputSachetItemTunnel
                  close={closeTunnel}
                  sachetItems={sachetItemsData?.sachetItems}
               />
            </Tunnel>
            <Tunnel layer={3}>
               <SelectUserTunnel
                  close={closeTunnel}
                  users={userData?.settings_user?.map(user => ({
                     ...user,
                     name: `${user.firstName} ${user.lastName}`,
                  }))}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <SelectStationTunnel
                  close={closeTunnel}
                  stations={stationsData?.stations}
               />
            </Tunnel>
            <Tunnel layer={5}>
               <SelectInputBulkItemTunnel
                  close={closeTunnel}
                  bulkItems={sachetOrderState.supplierItem?.bulkItems}
               />
            </Tunnel>

            <Tunnel layer={6}>
               <SelectPackagingTunnel
                  packagings={packagingData?.packaging_packaging}
                  close={closeTunnel}
               />
            </Tunnel>
            <Tunnel layer={7}>
               <SelectLabelTemplateTunnel close={closeTunnel} />
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
                  <ItemCard
                     title={
                        sachetOrderState.supplierItem.name ||
                        sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                           ?.supplierItem.name
                     }
                     edit={() => openTunnel(1)}
                  />
               ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text={t(address.concat('select supplier item'))}
                     onClick={() => openTunnel(1)}
                  />
               )}

               <br />

               {sachetOrderState.supplierItem?.name ||
                  (sachetWorkOrderData?.sachetWorkOrder?.bulkItem?.supplierItem
                     .name && (
                     <>
                        <Text as="title">
                           {t(address.concat('input bulk item'))}
                        </Text>
                        {sachetOrderState.inputItemProcessing?.processingName ||
                        sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                           ?.processingName ? (
                           <ItemCard
                              title={
                                 sachetOrderState.inputItemProcessing
                                    .processingName ||
                                 sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                                    ?.processingName
                              }
                              onHand={
                                 sachetOrderState.inputItemProcessing.onHand ||
                                 sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                                    ?.onHand
                              }
                              shelfLife={
                                 sachetOrderState.inputItemProcessing
                                    .shelfLife ||
                                 sachetWorkOrderData?.sachetWorkOrder?.bulkItem
                                    ?.shelfLife
                              }
                              edit={() => openTunnel(5)}
                           />
                        ) : (
                           <ButtonTile
                              noIcon
                              type="secondary"
                              text={t(address.concat('select input bulk item'))}
                              onClick={() => openTunnel(5)}
                           />
                        )}
                     </>
                  ))}

               <Spacer />

               {sachetOrderState.inputItemProcessing?.id ||
                  (sachetWorkOrderData?.sachetWorkOrder?.bulkItem?.id && (
                     <>
                        <Text as="title">
                           {t(address.concat('output sachet item'))}
                        </Text>
                        {sachetOrderState.outputSachet?.unitSize ||
                        sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem
                           ?.unitSize ? (
                           <ItemCard
                              title={
                                 `${sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem.unitSize} ${sachetWorkOrderData?.sachetWorkOrder?.outputSachetItem.unit}` ||
                                 `${sachetOrderState.outputSachet.unitSize} ${sachetOrderState.outputSachet.unit}`
                              }
                              onHand={
                                 sachetOrderState.outputSachet.onHand ||
                                 sachetWorkOrderData?.sachetWorkOrder
                                    ?.outputSachetItem.onHand
                              }
                              par={
                                 sachetOrderState.outputSachet.parLevel ||
                                 sachetWorkOrderData?.sachetWorkOrder
                                    ?.outputSachetItem.parLevel
                              }
                              edit={() => {
                                 openTunnel(2)
                              }}
                           />
                        ) : (
                           <ButtonTile
                              noIcon
                              type="secondary"
                              text={t(
                                 address.concat('select output sachet item')
                              )}
                              onClick={() => {
                                 openTunnel(2)
                              }}
                           />
                        )}
                     </>
                  ))}

               {sachetOrderState.outputSachet?.id && (
                  <Configurator open={openTunnel} />
               )}
            </StyledForm>
         </StyledWrapper>
      </SachetOrderContext.Provider>
   )
}

function Configurator({ open }) {
   const { t } = useTranslation()
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )

   const [assignedDate, setAssignedDate] = useState('')

   return (
      <>
         <Spacer />

         <Text as="title">{t(address.concat('enter number of sachets'))}</Text>
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
                  <span style={{ color: '#00a7e1', fontWeight: '400' }}>-</span>
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
                  <AddIcon />
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
                  edit={() => open(6)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select packaging'))}
                  onClick={() => open(6)}
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
                        edit={() => open(7)}
                     />
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat('select label template'))}
                        onClick={() => open(7)}
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
                  edit={() => open(3)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(address.concat('select and assign user to work'))}
                  onClick={() => open(3)}
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
                  edit={() => open(4)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text={t(
                     address.concat('select and assign station to route to')
                  )}
                  onClick={() => open(4)}
               />
            )}
         </>
         <br />
      </>
   )
}
