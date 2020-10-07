import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   Loader,
   Tag,
   TagGroup,
   Text,
   Tunnel,
   TunnelHeader,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import { TunnelContainer } from '../../../../../components'
import { ItemContext } from '../../../../../context/item'
import {
   CREATE_BULK_ITEM,
   UNITS_SUBSCRIPTION,
   UPDATE_BULK_ITEM,
} from '../../../../../graphql'
import { StyledSelect } from '../../../styled'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'
import AllergensTunnelForDerivedProcessing from '../AllergensTunnel'
import NutritionTunnel from '../NutritionTunnel'
import {
   Highlight,
   InputWrapper,
   StyledInputGroup,
   StyledLabel,
   StyledRow,
   ImageContainer,
} from '../styled'

import PhotoTunnel from './PhotoTunnel'

const address =
   'apps.inventory.views.forms.item.tunnels.configurederivedprocessingtunnel.'

export default function ConfigureDerivedProcessingTunnel({ close, formState }) {
   const { t } = useTranslation()
   const {
      state: { configurable },
      state,
      dispatch,
   } = useContext(ItemContext)

   const [units, setUnits] = useState([])

   const [errors, setErrors] = useState([])

   const [unit, setUnit] = useState(
      state.activeProcessing?.unit || formState?.unit
   )
   const [par, setPar] = useState(state.activeProcessing?.parLevel || '')

   const [maxInventoryLevel, setMaxInventoryLevel] = useState(
      state.activeProcessing?.maxLevel || ''
   )

   const [laborTime, setLaborTime] = useState(
      state.activeProcessing?.labor?.value || ''
   )
   const [laborUnit, setLaborUnit] = useState(
      state.activeProcessing?.labor?.unit || 'hours'
   )
   const [yieldPercentage, setYieldPercentage] = useState(
      state.activeProcessing?.yield?.value || ''
   )
   const [shelfLife, setShelfLife] = useState(
      state.activeProcessing?.shelfLife?.value || ''
   )
   const [shelfLifeUnit, setShelfLifeUnit] = useState(
      state.activeProcessing?.shelfLife?.unit || 'hours'
   )
   const [bulkDensity, setBulkDensity] = useState(
      state.activeProcessing?.bulkDensity || ''
   )

   const [
      allergensTunnelForDerivedProcessing,
      openDerivedAllergensTunnel,
      closeDerivedAllergensTunnel,
   ] = useTunnel(1)
   const [
      nutritionTunnel,
      openNutritionTunnel,
      closeNutritionTunnel,
   ] = useTunnel(1)

   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

   const { loading: unitsLoading } = useSubscription(UNITS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.units
         setUnits(data)
         if (!unit) setUnit(data[0].name)
      },
   })

   const [createBulkItem, { loading }] = useMutation(CREATE_BULK_ITEM, {
      onCompleted: () => {
         close(2)
         toast.success('Bulk Item Created!')
      },
      onError: error => {
         console.log(error)
         close(2)
         toast.error(error.message)
      },
   })

   const [udpateBulkItem, { loading: updateBulkItemLoading }] = useMutation(
      UPDATE_BULK_ITEM,
      {
         onCompleted: () => {
            close(2)
            dispatch({
               type: 'SET_ACTIVE_PROCESSING',
               payload: {
                  ...formState.bulkItemAsShipped,
                  unit, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +par,
                  nutritionInfo: state.processing.nutrients || {},
                  maxLevel: +maxInventoryLevel,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: state.processing.allergens,
               },
            })
            toast.success('Bulk Item updated successfully !')
         },
         onError: error => {
            console.log(error)
            toast.error(error.message)
            close(2)
         },
      }
   )

   const handleNext = () => {
      if (!par || !maxInventoryLevel)
         return toast.error('Please fill the form properly')
      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else if (state.derAction === 'UPDATE') {
         udpateBulkItem({
            variables: {
               id: state.activeProcessing.id,
               object: {
                  unit, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +par,
                  nutritionInfo: state.configurable.nutrients || {},
                  maxLevel: +maxInventoryLevel,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: state.processing.allergens,
               },
            },
         })
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

   if (loading || updateBulkItemLoading || unitsLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={allergensTunnelForDerivedProcessing}>
            <Tunnel layer={1}>
               <AllergensTunnelForDerivedProcessing
                  close={() => closeDerivedAllergensTunnel(1)}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={nutritionTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <NutritionTunnel
                  close={closeNutritionTunnel}
                  bulkItemId={state.activeProcessing.id}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={photoTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <PhotoTunnel close={closePhotoTunnel} />
            </Tunnel>
         </Tunnels>

         <TunnelHeader
            title={t(address.concat('configure processing'))}
            close={() => close(2)}
            right={{ title: 'Save', action: handleNext }}
         />

         <TunnelContainer>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('set par level'))}
                        name="par level"
                        value={par}
                        onChange={e => setPar(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('max inventory level'))}
                        name="max inventory level"
                        value={maxInventoryLevel}
                        onChange={e => setMaxInventoryLevel(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
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
                     value={unit}
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
            {state.activeProcessing?.id && (
               <StyledRow>
                  {state.activeProcessing?.image ? (
                     <ImageContainer>
                        <div>
                           <span
                              role="button"
                              tabIndex="0"
                              onClick={() => openPhotoTunnel(1)}
                              onKeyDown={e =>
                                 e.charCode === 13 && openPhotoTunnel(1)
                              }
                           >
                              <EditIcon />
                           </span>
                        </div>
                        <img
                           src={state.activeProcessing?.image}
                           alt="processing"
                        />
                     </ImageContainer>
                  ) : (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text={t(address.concat('add photo to your processing'))}
                        helper={t(
                           address.concat(
                              'upto 1MB - only JPG, PNG, PDF allowed'
                           )
                        )}
                        onClick={() => openPhotoTunnel(1)}
                     />
                  )}
               </StyledRow>
            )}
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('labour time per 100gm'))}
                        name="labor time"
                        value={laborTime}
                        onChange={e => setLaborTime(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <StyledSelect
                        name="unit"
                        value={laborUnit}
                        onChange={e => setLaborUnit(e.target.value)}
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="minutes">{t('units.minutes')}</option>
                     </StyledSelect>
                  </InputWrapper>

                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('percentage of yield'))}
                        name="yield"
                        value={yieldPercentage}
                        onChange={e => setYieldPercentage(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <span>%</span>
                  </InputWrapper>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('shelf life'))}
                        name="shelf life"
                        value={shelfLife}
                        onChange={e => setShelfLife(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <StyledSelect
                        name="unit"
                        value={shelfLifeUnit}
                        onChange={e => setShelfLifeUnit(e.target.value)}
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="days">{t('units.days')}</option>
                     </StyledSelect>
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('bulk density'))}
                        name="bulk density"
                        value={bulkDensity}
                        onChange={e => setBulkDensity(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
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
                        openNutritionTunnel(1)
                     }}
                     type="ghost"
                  >
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </StyledLabel>
               {state.configurable.nutrients?.totalFat ||
               state.configurable.nutrients?.calories ? (
                  <Nutrition
                     data={{
                        calories: state.configurable.nutrients.calories,
                        totalFat: state.configurable.nutrients.totalFat,
                        transFat: state.configurable.nutrients.transFat,
                        saturatedFat: state.configurable.nutrients.saturatedFat,
                        cholesterol: state.configurable.nutrients.cholesterol,
                        sodium: state.configurable.nutrients.sodium,
                        totalCarbohydrates:
                           state.configurable.nutrients.totalCarbohydrates,
                        dietaryFibre: state.configurable.nutrients.dietaryFibre,
                        sugars: state.configurable.nutrients.sugars,
                        protein: state.configurable.nutrients.protein,
                        vitaminA: state.configurable.nutrients.vitaminA,
                        vitaminC: state.configurable.nutrients.vitaminC,
                        iron: state.configurable.nutrients.iron,
                        calcium: state.configurable.nutrients.calcium,
                     }}
                  />
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add nutritions'))}
                     onClick={() => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'deriveProcessing',
                        })
                        openNutritionTunnel(1)
                     }}
                  />
               )}
            </StyledRow>
            <StyledRow>
               <StyledLabel>{t(address.concat('allergens'))}</StyledLabel>
               {configurable.allergens?.length ? (
                  <Highlight
                     pointer
                     onClick={() => openDerivedAllergensTunnel(1)}
                  >
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
                     onClick={() => openDerivedAllergensTunnel(1)}
                  />
               )}
            </StyledRow>
         </TunnelContainer>
      </>
   )
}
