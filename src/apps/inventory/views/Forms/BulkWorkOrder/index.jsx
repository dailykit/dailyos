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

import { useTranslation } from 'react-i18next'

import {
   BulkOrderContext,
   state as initialState,
   reducers,
} from '../../../context/bulkOrder'

import FormHeading from '../../../components/FormHeading'
import {
   FormActions,
   StyledWrapper,
   StyledForm,
   FlexContainer,
} from '../styled'
import { Spacer, ItemCard } from '../../../components'
import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import SelectOutputBulkItemTunnel from './Tunnels/SelectOutputBulkItemTunnel'
import SelectInputBulkItemTunnel from './Tunnels/SelectInputBulkItemTunnel'
import SelectUserTunnel from './Tunnels/SelectUserTunnel'
import SelectStationTunnel from './Tunnels/SelectStationTunnel'

const address = 'apps.inventory.views.forms.bulkworkorder.'

export default function BulkWorkOrderForm() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(5)
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
            <Tunnel layer={5}>
               <SelectInputBulkItemTunnel close={closeTunnel} />
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
                     {t(address.concat('work order'))}{' '}
                     {bulkOrderState.supplierItem?.title &&
                        `- ${bulkOrderState.supplierItem.title}`}
                  </Text>
               </div>

               <FormActions>
                  <TextButton onClick={() => { }} type="solid">
                     {t(address.concat('publish'))}
                  </TextButton>
               </FormActions>
            </FormHeading>

            <StyledForm style={{ padding: '0px 60px' }}>
               <Text as="title">{t(address.concat('select supplier item'))}</Text>
               {bulkOrderState.supplierItem?.title ? (
                  <ItemCard
                     title={bulkOrderState.supplierItem.title}
                     edit={() => openTunnel(1)}
                  />
               ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text={t(address.concat("select supplier item"))}
                        onClick={e => openTunnel(1)}
                     />
                  )}

               <br />

               {bulkOrderState.supplierItem?.title && (
                  <>
                     <Text as="title">{t(address.concat('input bulk item'))}</Text>
                     {bulkOrderState.inputItemProcessing?.title ? (
                        <ItemCard
                           title={bulkOrderState.inputItemProcessing.title}
                           onHand={bulkOrderState.inputItemProcessing.onHand}
                           shelfLife={
                              bulkOrderState.inputItemProcessing.shelfLife
                           }
                           edit={() => openTunnel(2)}
                        />
                     ) : (
                           <ButtonTile
                              noIcon
                              type="secondary"
                              text={t(address.concat("select input bulk item"))}
                              onClick={() => openTunnel(5)}
                           />
                        )}
                  </>
               )}

               <Spacer />

               {bulkOrderState.supplierItem?.title && (
                  <>
                     <Text as="title">{t(address.concat('output bulk item'))}</Text>
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
                              text={t(address.concat("select output bulk item"))}
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
   const { t } = useTranslation()
   const { bulkOrderState, bulkOrderDispatch } = useContext(BulkOrderContext)
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkOrderState.outputItemProcessing.yield || ''
   )
   const [outputQuantity, setOutputQuantity] = useState('')
   const [assignedDate, setAssignedDate] = useState('')

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
               placeholder={t(address.concat("yield percentage"))}
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
         <FlexContainer
            style={{ width: '50%', justifyContent: 'space-between' }}
         >
            <div style={{ width: '45%' }}>
               <Input
                  type="text"
                  placeholder={t(address.concat("enter output quantity"))}
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
                     <Text as="subtitle">{t(address.concat('suggested committed quantity'))}</Text>
                     <Text as="title">
                        {Math.round((outputQuantity * 100) / yieldPercentage)}
                     </Text>
                  </>
               )}
            </div>
         </FlexContainer>

         <br />

         <>
            {bulkOrderState.assignedUser?.title ? (
               <ItemCard
                  title={bulkOrderState.assignedUser.title}
                  edit={() => open(3)}
               />
            ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text={t(address.concat("select and assign user to work"))}
                     onClick={e => open(3)}
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
            placeholder={t(address.concat("date (mm/dd/yyyy)"))}
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

            {bulkOrderState.selectedStation?.title ? (
               <ItemCard
                  title={bulkOrderState.selectedStation.title}
                  edit={() => open(4)}
               />
            ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text={t(address.concat("select and assign station to route to"))}
                     onClick={e => open(4)}
                  />
               )}
         </>
         <br />
      </>
   )
}
