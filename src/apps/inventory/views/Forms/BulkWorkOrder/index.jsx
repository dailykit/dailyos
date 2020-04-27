import React, { useReducer, useState, useContext } from 'react'
import {
   TextButton,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
   ButtonTile,
   Input,
} from '@dailykit/ui/'

import {
   BulkOrderContext,
   state as initialState,
   reducers,
} from '../../../context/bulkOrder'

import FormHeading from '../../../components/FormHeading'
import { FormActions, StyledWrapper, StyledForm } from '../styled'
import { Spacer, ItemCard } from '../../../components'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectOutputBulkItemTunnel from './Tunnels/SelectOutputBulkItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'

export default function BulkWorkOrderForm() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(4)
   const [bulkOrderState, bulkOrderDispatch] = useReducer(
      reducers,
      initialState
   )

   return (
      <BulkOrderContext.Provider value={{ bulkOrderState, bulkOrderDispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SelectSupplierItemTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <SelectOutputBulkItemTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <SelectUserTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={4}>
               <SelectStationTunnel close={closeTunnel} />
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
                     {bulkOrderState.supplierItem?.title &&
                        `- ${bulkOrderState.supplierItem.title}`}
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
               {bulkOrderState.supplierItem?.title ? (
                  <ItemCard
                     title={bulkOrderState.supplierItem.title}
                     shippedProcessing={bulkOrderState.supplierItem.shippedProcessing.map(
                        processing => processing.title
                     )}
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

               <Spacer />

               {bulkOrderState.supplierItem?.title && (
                  <>
                     <Text as="title">Output Bulk item</Text>
                     {bulkOrderState.outputItemProcessing?.title ? (
                        <ItemCard
                           title={bulkOrderState.outputItemProcessing.title}
                           onHand={bulkOrderState.outputItemProcessing.onHand}
                           shelfLife={
                              bulkOrderState.outputItemProcessing.shelfLife
                           }
                           edit={() => openTunnel(2)}
                        />
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Output Bulk Item"
                           onClick={e => openTunnel(2)}
                        />
                     )}
                  </>
               )}

               {bulkOrderState.outputItemProcessing?.title && (
                  <Configurator open={openTunnel} />
               )}
            </StyledForm>
         </StyledWrapper>
      </BulkOrderContext.Provider>
   )
}

function Configurator({ open }) {
   const { bulkOrderState, bulkOrderDispatch } = useContext(BulkOrderContext)
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkOrderState.outputItemProcessing.yield || ''
   )
   const [outputQuantity, setOutputQuantity] = useState('')

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
               type="text"
               placeholder="Yield Percentage"
               name="yield"
               value={yieldPercentage}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value.length === 0) setYieldPercentage('')
                  if (value) {
                     setYieldPercentage(e.target.value)
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
         <div style={{ width: '20%' }}>
            <Input
               type="text"
               placeholder="Enter Output Quantity"
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

         <br />

         <>
            <Text as="title">User Assigned</Text>

            {bulkOrderState.assignedUser?.title ? (
               <ItemCard
                  title={bulkOrderState.assignedUser.title}
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

         <>
            <Text as="title">Station Assigned</Text>

            {bulkOrderState.selectedStation?.title ? (
               <ItemCard
                  title={bulkOrderState.selectedStation.title}
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
