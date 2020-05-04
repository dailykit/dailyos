import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Input,
   ButtonTile,
   TagGroup,
   Tag,
   IconButton,
   Text,
} from '@dailykit/ui'

import { CREATE_BULK_ITEM } from '../../../../../graphql'

import { ItemContext } from '../../../../../context/item'

import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

import {
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
   StyledSelect,
   StyledLabel,
} from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.configurederivedprocessingtunnel.'

export default function ConfigureDerivedProcessingTunnel({ close, open }) {
   const { t } = useTranslation()
   const {
      state: { configurable },
      state,
      dispatch,
   } = useContext(ItemContext)

   const [createBulkItem] = useMutation(CREATE_BULK_ITEM)

   const [par, setPar] = useState('')
   const [parUnit, setParUnit] = useState('gram')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')
   const [maxInventoryUnit, setMaxInventoryUnit] = useState('gram')
   const [laborTime, setLaborTime] = useState('')
   const [laborUnit, setLaborUnit] = useState('hours')
   const [yieldPercentage, setYieldPercentage] = useState('')
   const [shelfLife, setShelfLife] = useState('')
   const [shelfLifeUnit, setShelfLifeUnit] = useState('hours')
   const [bulkDensity, setBulkDensity] = useState('')

   const handleNext = async () => {
      const res = await createBulkItem({
         variables: {
            processingName: state.configurable.title,
            itemId: state.id,
            unit: parUnit,
         },
      })

      if (res?.data?.createBulkItem) {
         dispatch({
            type: 'CONFIGURE_DERIVED_PROCESSING',
            payload: {
               id: res?.data?.createBulkItem?.returning[0].id,
               par,
               parUnit,
               maxInventoryLevel,
               maxInventoryUnit,
               laborTime,
               laborUnit,
               yieldPercentage,
               shelfLife,
               shelfLifeUnit,
               bulkDensity,
            },
         })
      }
      close(7)
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("configure processing"))}
            next={handleNext}
            close={() => close(7)}
            nextAction="Save"
         />

         <Spacer />

         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("set par level"))}
                     name="par_level"
                     value={par}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setPar('')
                        if (value) setPar(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={parUnit}
                     onChange={e => setParUnit(e.target.value)}
                  >
                     <option value="gram">{t('units.gram')}</option>
                     <option value="loaf">{t('units.loaf')}</option>
                  </StyledSelect>
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("max inventory level"))}
                     name="max_inventory_level"
                     value={maxInventoryLevel}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0)
                           setMaxInventoryLevel('')
                        if (value) setMaxInventoryLevel(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={maxInventoryUnit}
                     onChange={e => setMaxInventoryUnit(e.target.value)}
                  >
                     <option value="gram">{t('units.gram')}</option>
                     <option value="loaf">{t('units.loaf')}</option>
                  </StyledSelect>
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledLabel>{t(address.concat('processing information'))}</StyledLabel>
         </StyledRow>
         <StyledRow>
            <ButtonTile
               type="primary"
               size="sm"
               text={t(address.concat("add photo to your processing"))}
               helper={t(address.concat("upto 1MB - only JPG, PNG, PDF allowed"))}
               onClick={e => console.log('Tile clicked')}
            />
         </StyledRow>
         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("labor time per 100gm"))}
                     name="labor_time"
                     value={laborTime}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setLaborTime('')
                        if (value) setLaborTime(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={laborUnit}
                     onChange={e => setLaborUnit(e.target.value)}
                  >
                     <option value="hours">{t('units.hours')}</option>
                     <option value="minutes">{t('units.minutes')}</option>
                  </StyledSelect>
               </InputWrapper>

               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("percentage of yield"))}
                     name="yield"
                     value={yieldPercentage}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setYieldPercentage('')
                        if (value) setYieldPercentage(value)
                     }}
                  />
                  <span>%</span>
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("shelf life"))}
                     name="shelf_life"
                     value={shelfLife}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setShelfLife('')
                        if (value) setShelfLife(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={shelfLifeUnit}
                     onChange={e => setShelfLifeUnit(e.target.value)}
                  >
                     <option value="hours">{t('units.hours')}</option>
                     <option value="days">{t('units.days')}</option>
                  </StyledSelect>
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat("bulk density"))}
                     name="bulk_density"
                     value={bulkDensity}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setBulkDensity('')
                        if (value) setBulkDensity(value)
                     }}
                  />
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledLabel
               style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
               }}
            >
               <div>{t(address.concat('nutritions per 100gm'))}</div>
               <IconButton
                  onClick={() => {
                     dispatch({
                        type: 'SET_NUTRI_TARGET',
                        payload: 'deriveProcessing',
                     })
                     open(10)
                  }}
                  type="ghost"
               >
                  <EditIcon />
               </IconButton>
            </StyledLabel>
            {state.configurable.nutrients?.fat ||
               state.configurable.nutrients?.cal ? (
                  <>
                     <div
                        style={{
                           width: '70%',
                           minHeight: '100px',
                           backgroundColor: '#F3F3F3',
                           padding: '20px',
                        }}
                     >
                        <Text as="title">
                           <strong>{t(address.concat('calories'))}: </strong>
                           {state.configurable.nutrients?.cal}
                        </Text>

                        <Text as="title">
                           <strong>{t(address.concat('total fat'))}: </strong>
                           {state.configurable.nutrients?.fat}
                        </Text>
                     </div>
                  </>
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat("add nutritions"))}
                     onClick={e => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'deriveProcessing',
                        })
                        open(10)
                     }}
                  />
               )}
         </StyledRow>
         <StyledRow>
            <StyledLabel>{t(address.concat('allergens'))}</StyledLabel>
            {configurable.allergens?.length ? (
               <Highlight pointer onClick={() => open(8)}>
                  <TagGroup>
                     {configurable.allergens.map(el => (
                        <Tag key={el.id}> {el.title} </Tag>
                     ))}
                  </TagGroup>
               </Highlight>
            ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat("add allergens"))}
                     onClick={() => open(8)}
                  />
               )}
         </StyledRow>
      </TunnelContainer>
   )
}
