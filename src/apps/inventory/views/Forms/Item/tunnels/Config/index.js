import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   Loader,
   Tag,
   TagGroup,
   Text,
   TextButton,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import { CloseIcon } from '../../../../../assets/icons'
import { ItemContext } from '../../../../../context/item'
import { CREATE_BULK_ITEM, UPDATE_SUPPLIER_ITEM } from '../../../../../graphql'
import { StyledSelect } from '../../../styled'
import {
   Highlight,
   InputWrapper,
   StyledInputGroup,
   StyledLabel,
   StyledRow,
   TunnelBody,
   TunnelHeader,
} from '../styled'
import Nutrition from '../../../../../../../shared/components/Nutrition/index'

const address = 'apps.inventory.views.forms.item.tunnels.config.'

export default function ConfigTunnel({ close, open, units, formState }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ItemContext)

   const [parLevel, setParLevel] = useState('')
   const [maxValue, setMaxValue] = useState('')
   const [unit, setUnit] = useState(units[0].name)
   const [laborTime, setLaborTime] = useState('')
   const [laborUnit, setLaborUnit] = useState('')
   const [yieldPercentage, setYieldPercentage] = useState('')
   const [shelfLife, setShelfLife] = useState('')
   const [shelfLifeUnit, setShelfLifeUnit] = useState('')
   const [bulkDensity, setBulkDensity] = useState('')

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         close(4)
         toast.success('Bulk Item as Shipped Added!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error adding bulk item as shipped. Please try again')
         close(4)
      },
   })
   const [createBulkItem, { loading: createBulkItemLoading }] = useMutation(
      CREATE_BULK_ITEM,
      {
         onCompleted: data => {
            updateSupplierItem({
               variables: {
                  id: formState.id,
                  object: {
                     bulkItemAsShippedId: data.createBulkItem.returning[0].id,
                  },
               },
            })
         },
         onError: error => {
            console.log(error)
            toast.error('Error creating bulk item. Please try again')
            close(4)
         },
      }
   )

   const handleSave = () => {
      createBulkItem({
         variables: {
            processingName: state.processing.name,
            itemId: formState.id,
            unit, // string
            yield: { value: yieldPercentage },
            shelfLife: { unit: shelfLifeUnit, value: shelfLife },
            parLevel: +parLevel,
            nutritionInfo: state.processing.nutrients || {},
            maxLevel: +maxValue,
            labor: { value: laborTime, unit: laborTime },
            bulkDensity: +bulkDensity,
            allergens: state.processing.allergens,
         },
      })
   }

   if (createBulkItemLoading) return <Loader />

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={() => close(4)}>
                  <CloseIcon size={24} />
               </span>
               <span>
                  {t(address.concat('configure processing'))}:{' '}
                  {state.processing.name}
               </span>
            </div>
            <div>
               <TextButton onClick={handleSave} type="solid">
                  {t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('set par level'))}
                        name="par_level"
                        value={parLevel}
                        onChange={e => setParLevel(e.target.value)}
                     />
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('max inventory level'))}
                        name="max_inventory_level"
                        value={maxValue}
                        onChange={e => setMaxValue(e.target.value)}
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
                  {!state.form_meta.shipped && (
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat('labour time per 100gm'))}
                           name="labor_time"
                           value={laborTime}
                           onChange={e => setLaborTime(e.target.value)}
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
                  )}
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('percentage of yield'))}
                        name="yield"
                        value={yieldPercentage}
                        onChange={e => setYieldPercentage(e.target.value)}
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
                        name="shelf_life"
                        value={shelfLife}
                        onChange={e => setShelfLife(e.target.value)}
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={shelfLifeUnit}
                        onChange={e => setShelfLifeUnit(e.target.value)}
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="minutes">{t('units.minutes')}</option>
                     </StyledSelect>
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('bulk dnesity'))}
                        name="bulk_density"
                        value={bulkDensity}
                        onChange={e => setBulkDensity(e.target.value)}
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
                           payload: 'processing',
                        })
                        open(10)
                     }}
                     type="ghost"
                  >
                     <EditIcon />
                  </IconButton>
               </StyledLabel>
               {state.processing.nutrients?.fat ||
               state.processing.nutrients?.cal ? (
                  <Nutrition
                     data={{
                        calories: state.processing.nutrients.cal,
                        totalFat: state.processing.nutrients.fat,
                        transFat: state.processing.nutrients.transFat,
                        saturatedFat: state.processing.nutrients.saturatedFat,
                        cholesterol: state.processing.nutrients.cholestrol,
                        sodium: state.processing.nutrients.sodium,
                        totalCarbohydrates: state.processing.nutrients.carbs,
                        dietaryFibre: state.processing.nutrients.dietryFiber,
                        sugars: state.processing.nutrients.sugar,
                        protein: state.processing.nutrients.protein,
                        vitaminA: state.processing.nutrients.vitA,
                        vitaminC: state.processing.nutrients.vitC,
                        iron: state.processing.nutrients.iron,
                        calcium: state.processing.nutrients.calcium,
                     }}
                  />
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add nutritions'))}
                     onClick={e => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'processing',
                        })
                        open(10)
                     }}
                  />
               )}
            </StyledRow>
            <StyledRow>
               <StyledLabel>{t(address.concat('allergens'))}</StyledLabel>
               {state.processing.allergens.length ? (
                  <Highlight pointer onClick={() => open(5)}>
                     <TagGroup>
                        {state.processing.allergens.map(el => (
                           <Tag key={el.id}> {el.title} </Tag>
                        ))}
                     </TagGroup>
                  </Highlight>
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add allergens'))}
                     onClick={() => open(5)}
                  />
               )}
            </StyledRow>
            {/* {!state.form_meta.shipped && (
               <>
                  <StyledRow>
                     <StyledLabel>
                        {t(
                           address.concat('operating procedure for processing')
                        )}
                     </StyledLabel>
                  </StyledRow>
                  <StyledRow>
                     <StyledLabel>
                        {t(address.concat('standard operating procedure'))}
                     </StyledLabel>
                     <Highlight></Highlight>
                  </StyledRow>
                  <StyledRow>
                     <StyledLabel>
                        {t(address.concat('equipments needed'))}
                     </StyledLabel>
                     <Highlight></Highlight>
                  </StyledRow>
               </>
            )} */}
         </TunnelBody>
      </>
   )
}
