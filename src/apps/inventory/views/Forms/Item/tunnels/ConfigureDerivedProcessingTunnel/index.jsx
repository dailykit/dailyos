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
import { useTranslation } from 'react-i18next'

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
import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'

const address =
   'apps.inventory.views.forms.item.tunnels.configurederivedprocessingtunnel.'

export default function ConfigureDerivedProcessingTunnel({
   close,
   open,
   units,
   formState,
}) {
   const { t } = useTranslation()
   const {
      state: { configurable },
      state,
      dispatch,
   } = useContext(ItemContext)

   const [errors, setErrors] = useState([])

   const [createBulkItem, { loading }] = useMutation(CREATE_BULK_ITEM, {
      onCompleted: () => {
         close(7)
         toast.success('Bulk Item Created!')
      },
      onError: error => {
         console.log(error)
         close(7)
         toast.error('Error! make sure you have filled the form properly')
      },
   })

   const [unit, setUnit] = useState('gram')
   const [par, setPar] = useState('')

   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [laborTime, setLaborTime] = useState('')
   const [laborUnit, setLaborUnit] = useState('hours')
   const [yieldPercentage, setYieldPercentage] = useState('')
   const [shelfLife, setShelfLife] = useState('')
   const [shelfLifeUnit, setShelfLifeUnit] = useState('hours')
   const [bulkDensity, setBulkDensity] = useState('')

   const handleNext = () => {
      if (!par || !maxInventoryLevel)
         return toast.error('Please fill the form properly')
      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else {
         createBulkItem({
            variables: {
               processingName: state.configurable.title,
               itemId: formState.id,
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
                     label={t(address.concat('set par level'))}
                     name="par level"
                     value={par}
                     onChange={e => setPar(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
                  />
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     label={t(address.concat('max inventory level'))}
                     name="max inventory level"
                     value={maxInventoryLevel}
                     onChange={e => setMaxInventoryLevel(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
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
                  {units.map(unit => (
                     <option key={unit.id} value={unit.name}>
                        {unit.name}
                     </option>
                  ))}
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
                     label={t(address.concat('labour time per 100gm'))}
                     name="labor time"
                     value={laborTime}
                     onChange={e => setLaborTime(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
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
                     label={t(address.concat('percentage of yield'))}
                     name="yield"
                     value={yieldPercentage}
                     onChange={e => setYieldPercentage(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
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
                     label={t(address.concat('shelf life'))}
                     name="shelf life"
                     value={shelfLife}
                     onChange={e => setShelfLife(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
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
                     label={t(address.concat('bulk density'))}
                     name="bulk density"
                     value={bulkDensity}
                     onChange={e => setBulkDensity(e.target.value)}
                     onBlur={e => handleNumberInputErrors(e, errors, setErrors)}
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
               <Nutrition
                  data={{
                     calories: state.configurable.nutrients.cal,
                     totalFat: state.configurable.nutrients.fat,
                     transFat: state.configurable.nutrients.transFat,
                     saturatedFat: state.configurable.nutrients.saturatedFat,
                     cholesterol: state.configurable.nutrients.cholestrol,
                     sodium: state.configurable.nutrients.sodium,
                     totalCarbohydrates: state.configurable.nutrients.carbs,
                     dietaryFibre: state.configurable.nutrients.dietryFiber,
                     sugars: state.configurable.nutrients.sugar,
                     protein: state.configurable.nutrients.protein,
                     vitaminA: state.configurable.nutrients.vitA,
                     vitaminC: state.configurable.nutrients.vitC,
                     iron: state.configurable.nutrients.iron,
                     calcium: state.configurable.nutrients.calcium,
                  }}
               />
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
