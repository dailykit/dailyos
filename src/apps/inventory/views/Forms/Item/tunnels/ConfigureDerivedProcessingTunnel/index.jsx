import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import {
   Input,
   ButtonTile,
   TagGroup,
   Tag,
   IconButton,
   Text,
   Loader,
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
   StyledLabel,
} from '../styled'

import { StyledSelect } from '../../../styled'

import { useTranslation } from 'react-i18next'

const address =
   'apps.inventory.views.forms.item.tunnels.configurederivedprocessingtunnel.'

export default function ConfigureDerivedProcessingTunnel({ close, open }) {
   const { t } = useTranslation()
   const {
      state: { configurable },
      state,
      dispatch,
   } = useContext(ItemContext)

   const [createBulkItem] = useMutation(CREATE_BULK_ITEM)

   const [unit, setUnit] = useState('gram')
   const [par, setPar] = useState('')

   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [laborTime, setLaborTime] = useState('')
   const [laborUnit, setLaborUnit] = useState('hours')
   const [yieldPercentage, setYieldPercentage] = useState('')
   const [shelfLife, setShelfLife] = useState('')
   const [shelfLifeUnit, setShelfLifeUnit] = useState('hours')
   const [bulkDensity, setBulkDensity] = useState('')

   const [loading, setLoading] = useState(false)

   const handleNext = async () => {
      try {
         setLoading(true)
         const res = await createBulkItem({
            variables: {
               processingName: state.configurable.title,
               itemId: state.id,
               unit,
               yield: { value: yieldPercentage },
               shelfLife: { unit: shelfLifeUnit, value: shelfLife },
               parLevel: +par,
               nutritionInfo: state.configurable.nutrients,
               maxLevel: +maxInventoryLevel,
               labor: { unit: laborUnit, value: laborTime },
               bulkDensity: +bulkDensity,
               allergens: state.configurable.allergens,
            },
         })

         if (res?.data?.createBulkItem) {
            setLoading(false)
            dispatch({
               type: 'CONFIGURE_DERIVED_PROCESSING',
               payload: {
                  id: res?.data?.createBulkItem?.returning[0].id,
                  par,
                  unit,
                  maxInventoryLevel,

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
         toast.success('Bulk Item Created!')
      } catch (error) {
         setLoading(false)
         toast.error('Err! make sure you have filled the form properly')
      }
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('configure processing'))}
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
                     placeholder={t(address.concat('set par level'))}
                     name="par_level"
                     value={par}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setPar('')
                        if (value) setPar(value)
                     }}
                  />
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     placeholder={t(address.concat('max inventory level'))}
                     name="max_inventory_level"
                     value={maxInventoryLevel}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0)
                           setMaxInventoryLevel('')
                        if (value) setMaxInventoryLevel(value)
                     }}
                  />
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <Text as="title">Select Unit:</Text>
               <span style={{ width: '10px' }} />
               <StyledSelect
                  name="unit"
                  defaultValue={unit}
                  onChange={e => setUnit(e.target.value)}
               >
                  <option value="gram">{t('units.gram')}</option>
                  <option value="loaf">{t('units.loaf')}</option>
               </StyledSelect>
            </div>
         </StyledRow>
         <StyledRow>
            <StyledLabel>
               {t(address.concat('processing information'))}
            </StyledLabel>
         </StyledRow>
         <StyledRow>
            <ButtonTile
               type="primary"
               size="sm"
               text={t(address.concat('add photo to your processing'))}
               helper={t(
                  address.concat('upto 1MB - only JPG, PNG, PDF allowed')
               )}
               onClick={e => console.log('Tile clicked')}
            />
         </StyledRow>
         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     placeholder={t(address.concat('labor time per 100gm'))}
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
                     placeholder={t(address.concat('percentage of yield'))}
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
                     placeholder={t(address.concat('shelf life'))}
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
                     placeholder={t(address.concat('bulk density'))}
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
                  text={t(address.concat('add nutritions'))}
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
                  text={t(address.concat('add allergens'))}
                  onClick={() => open(8)}
               />
            )}
         </StyledRow>
      </TunnelContainer>
   )
}
