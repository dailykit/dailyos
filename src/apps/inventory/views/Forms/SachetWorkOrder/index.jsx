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

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.sachetworkorder.'

export default function SachetWorkOrder() {
   const { t } = useTranslation()
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
                     {t(address.concat('work order'))}{' '}
                     {sachetOrderState.supplierItem?.title &&
                        `- ${sachetOrderState.supplierItem.title}`}
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
               {sachetOrderState.supplierItem?.title ? (
                  <ItemCard
                     title={sachetOrderState.supplierItem.title}
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

               {sachetOrderState.supplierItem?.title && (
                  <>
                     <Text as="title">{t(address.concat('input bulk item'))}</Text>
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
                              text={t(address.concat("select input bulk item"))}
                              onClick={() => openTunnel(5)}
                           />
                        )}
                  </>
               )}

               <Spacer />

               {sachetOrderState.inputItemProcessing?.title && (
                  <>
                     <Text as="title">{t(address.concat('output sachet item'))}</Text>
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
                              text={t(address.concat("select output sachet item"))}
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
                     <Text as="subtitle">{t(address.concat('suggested committed quantity'))}</Text>
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

         <Text as="title">{t(address.concat('packaging'))}</Text>

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
                     text={t(address.concat("select packaging"))}
                     onClick={e => open(6)}
                  />
               )}
         </>

         <br />

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
                     text={t(address.concat("select label template"))}
                     onClick={e => open(7)}
                  />
               )}
         </>

         <br />

         <Text as="title">{t(address.concat('user assigned'))}</Text>

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
               sachetOrderDispatch({
                  type: 'SET_ASSIGNED_DATE',
                  payload: assignedDate,
               })
            }}
         />

         <br />

         <>
            <Text as="title">{t(address.concat('station assigned'))}</Text>

            {sachetOrderState.selectedStation?.title ? (
               <ItemCard
                  title={sachetOrderState.selectedStation.title}
                  edit={() => open(4)}
               />
            ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text={t(address.concat("Select and assign station to route to"))}
                     onClick={e => open(4)}
                  />
               )}
         </>
         <br />
      </>
   )
}
