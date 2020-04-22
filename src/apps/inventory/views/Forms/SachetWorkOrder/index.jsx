import React, { useReducer, useState, useContext } from 'react'
import {
   TextButton,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
   ButtonTile,
   Input,
   IconButton,
} from '@dailykit/ui/'

import {
   SachetOrderContext,
   state as initialState,
   reducers,
} from '../../../context/sachetOrder'

import FormHeading from '../../../components/FormHeading'
import {
   FormActions,
   StyledWrapper,
   StyledForm,
   FlexContainer,
} from '../styled'
import { Spacer, ItemCard } from '../../../components'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectOutputSachetItemTunnel from './Tunnels/SelectOutputSachetItemTunnel'
import SelectInputBulkItemTunnel from './Tunnels/SelectInputBulkItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'
import SelectPackagingTunnel from './Tunnels/SelectPackagingTunnel'
import SelectLabelTemplateTunnel from './Tunnels/SelectLabelTemplateTunnel'
import AddIcon from '../../../../../shared/assets/icons/Add'

export default function SachetWorkOrder() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(7)
   const [sachetOrderState, sachetOrderDispatch] = useReducer(
      reducers,
      initialState
   )

   return (
      <SachetOrderContext.Provider
         value={{ sachetOrderState, sachetOrderDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SelectSupplierItemTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <SelectOutputSachetItemTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <SelectUserTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={4}>
               <SelectStationTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
               <SelectInputBulkItemTunnel close={closeTunnel} />
            </Tunnel>

            <Tunnel layer={6}>
               <SelectPackagingTunnel close={closeTunnel} />
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
                  {/* TODO: add text here for input item */}
                  <Text as="h1">
                     Work Order{' '}
                     {sachetOrderState.supplierItem?.title &&
                        `- ${sachetOrderState.supplierItem.title}`}
                  </Text>
               </div>

               <FormActions>
                  <TextButton onClick={() => {}} type="solid">
                     Publish
                  </TextButton>
               </FormActions>
            </FormHeading>

            <StyledForm style={{ padding: '0px 60px' }}>
               <Text as="title">Select supplier item</Text>
               {sachetOrderState.supplierItem?.title ? (
                  <ItemCard
                     title={sachetOrderState.supplierItem.title}
                     edit={() => openTunnel(1)}
                  />
               ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text="Select Supplier Item"
                     onClick={e => openTunnel(1)}
                  />
               )}

               <br />

               {sachetOrderState.supplierItem?.title && (
                  <>
                     <Text as="title">Input Bulk item</Text>
                     {sachetOrderState.inputItemProcessing?.title ? (
                        <ItemCard
                           title={sachetOrderState.inputItemProcessing.title}
                           onHand={sachetOrderState.inputItemProcessing.onHand}
                           shelfLife={
                              sachetOrderState.inputItemProcessing.shelfLife
                           }
                           edit={() => openTunnel(5)}
                        />
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Input Bulk Item"
                           onClick={() => openTunnel(5)}
                        />
                     )}
                  </>
               )}

               <Spacer />

               {sachetOrderState.inputItemProcessing?.title && (
                  <>
                     <Text as="title">Output Sachet item</Text>
                     {sachetOrderState.outputSachet?.title ? (
                        <ItemCard
                           title={sachetOrderState.outputSachet.title}
                           par={sachetOrderState.outputSachet.par}
                           available={`${sachetOrderState.outputSachet.available} / ${sachetOrderState.outputSachet.total}`}
                           edit={() => openTunnel(2)}
                        />
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Output Sachet Item"
                           onClick={e => openTunnel(2)}
                        />
                     )}
                  </>
               )}

               {sachetOrderState.outputSachet?.title && (
                  <Configurator open={openTunnel} />
               )}
            </StyledForm>
         </StyledWrapper>
      </SachetOrderContext.Provider>
   )
}

function Configurator({ open }) {
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )

   const [assignedDate, setAssignedDate] = useState('')

   return (
      <>
         <Spacer />

         <Text as="title">Enter Number of Sachets</Text>
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
                     <Text as="subtitle">Suggested committed quantity</Text>
                     <Text as="title">
                        {Math.round(
                           sachetOrderState.sachetQuantity *
                              +sachetOrderState.outputSachet.quantity
                        )}
                     </Text>
                  </>
               )}
            </div>
         </FlexContainer>

         <br />

         <Text as="title">Packaging</Text>

         <>
            {sachetOrderState.packaging?.title ? (
               <ItemCard
                  title={sachetOrderState.packaging.title}
                  edit={() => open(6)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text="Select packaging"
                  onClick={e => open(6)}
               />
            )}
         </>

         <br />

         <Text as="title">Label Template</Text>

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
                  text="Select Label Template"
                  onClick={e => open(7)}
               />
            )}
         </>

         <br />

         <Text as="title">User Assigned</Text>

         <>
            {sachetOrderState.assignedUser?.title ? (
               <ItemCard
                  title={sachetOrderState.assignedUser.title}
                  edit={() => open(3)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text="Select and assign user to work"
                  onClick={e => open(3)}
               />
            )}
         </>

         <br />
         <br />

         <Text as="title">Scheduled On</Text>
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
            placeholder="Date (mm/dd/yyyy)"
            onBlur={() => {
               sachetOrderDispatch({
                  type: 'SET_ASSIGNED_DATE',
                  payload: assignedDate,
               })
            }}
         />

         <br />

         <>
            <Text as="title">Station Assigned</Text>

            {sachetOrderState.selectedStation?.title ? (
               <ItemCard
                  title={sachetOrderState.selectedStation.title}
                  edit={() => open(4)}
               />
            ) : (
               <ButtonTile
                  noIcon
                  type="secondary"
                  text="Select and assign station to route to"
                  onClick={e => open(4)}
               />
            )}
         </>
         <br />
      </>
   )
}
