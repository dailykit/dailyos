import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Loader,
   Tag,
   TagGroup,
   Tunnel,
   TunnelHeader,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   NutritionTunnel,
   Tooltip,
} from '../../../../../../../shared/components'
import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import { ERROR_UPDATING_BULK_ITEM } from '../../../../../constants/errorMessages'
import { BULK_ITEM_UPDATED } from '../../../../../constants/successMessages'
import { VALUE_SHOULD_BE_NUMBER } from '../../../../../constants/validationMessages'
import {
   NUTRITION_INFO,
   UNITS_SUBSCRIPTION,
   UPDATE_BULK_ITEM,
} from '../../../../../graphql'
import AllergensTunnel from '../Allergens'
import {
   Highlight,
   ImageContainer,
   StyledInputGroup,
   StyledLabel,
   StyledRow,
   TunnelBody,
} from '../styled'
import PhotoTunnel from './PhotoTunnel'

const address = 'apps.inventory.views.forms.item.tunnels.config.'

export default function ConfigTunnel({
   close,
   proc: bulkItem,
   id,
   fromTunnel,
   closeParent,
}) {
   const { t } = useTranslation()

   const [errors, setErrors] = useState([])

   const [units, setUnits] = useState([])
   const [parLevel, setParLevel] = useState(bulkItem?.parLevel || 0)
   const [maxValue, setMaxValue] = useState(bulkItem?.maxLevel || '')
   const [unit, setUnit] = useState(bulkItem?.unit)
   const [laborTime, setLaborTime] = useState(bulkItem?.labor?.value || '')
   const [laborUnit, setLaborUnit] = useState(bulkItem?.labor?.unit || 'hours')
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkItem?.yield?.value || ''
   )
   const [shelfLife, setShelfLife] = useState(bulkItem?.shelfLife?.value || '')
   const [shelfLifeUnit, setShelfLifeUnit] = useState(
      bulkItem?.shelfLife?.unit || 'hours'
   )
   const [bulkDensity, setBulkDensity] = useState(bulkItem?.bulkDensity || '')

   useSubscription(UNITS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.units
         setUnits(data)
         if (!unit) setUnit(data[0].name)
      },
   })

   const [
      allergensTunnel,
      openAllergensTunnel,
      closeAllergensTunnel,
   ] = useTunnel(1)

   const [
      nutritionTunnel,
      openNutritionTunnel,
      closeNutritionTunnel,
   ] = useTunnel(1)

   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

   const [udpateBulkItem, { loading }] = useMutation(UPDATE_BULK_ITEM, {
      onCompleted: () => {
         toast.success(BULK_ITEM_UPDATED)
      },
      onError: error => {
         console.log(error)
         toast.error(ERROR_UPDATING_BULK_ITEM)
         close(1)
         fromTunnel && closeParent()
      },
   })

   const handleSave = () => {
      if (!parLevel || !maxValue)
         return toast.error('Please fill the form properly')

      const allergens = bulkItem.allergens
      udpateBulkItem({
         variables: {
            id: id || bulkItem.id,
            object: {
               unit: unit || units[0]?.title, // string
               yield: { value: yieldPercentage },
               shelfLife: { unit: shelfLifeUnit, value: shelfLife },
               parLevel: +parLevel,
               maxLevel: +maxValue,
               labor: { value: laborTime, unit: laborUnit },
               bulkDensity: +bulkDensity,
               allergens: allergens?.length ? allergens : [],
            },
         },
      })
      close(1)
      fromTunnel && closeParent()
   }

   const handleNutriData = data => {
      udpateBulkItem({
         variables: {
            id: id || bulkItem.id,
            object: {
               nutritionInfo: data,
            },
         },
      })
   }

   const handleErrors = (e, location) => {
      const value = parseFloat(e.target.value)
      if (!value) {
         const alreadyExist = errors.filter(err => err.location === location)
            .length

         if (!alreadyExist) {
            setErrors([
               ...errors,
               {
                  location,
                  message: VALUE_SHOULD_BE_NUMBER,
               },
            ])
         }
      } else {
         const newErrors = errors.filter(err => err.location !== location)
         setErrors(newErrors)
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={allergensTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <AllergensTunnel
                  close={() => closeAllergensTunnel(1)}
                  bulkItemId={bulkItem?.id || id}
               />
            </Tunnel>
         </Tunnels>
         <NutritionTunnel
            closeTunnel={closeNutritionTunnel}
            onSave={handleNutriData}
            title="Add Nutrition Values"
            tunnels={nutritionTunnel}
            value={bulkItem.nutritionInfo}
         />

         <Tunnels tunnels={photoTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <PhotoTunnel
                  close={closePhotoTunnel}
                  bulkItemId={bulkItem?.id || id}
               />
            </Tunnel>
         </Tunnels>

         <TunnelHeader
            title={t(address.concat('configure processing'))}
            close={() => close(1)}
            right={{ title: t(address.concat('save')), action: handleSave }}
         />

         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label title="parLevel" htmlFor="parLevel">
                        <Flex container alignItems="center">
                           {t(address.concat('set par level'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_parLevel_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="parLevel"
                        placeholder="Par Level..."
                        name="par level"
                        value={parLevel}
                        onChange={e => setParLevel(e.target.value)}
                        onBlur={e => handleErrors(e, 'parLevel')}
                     />

                     {errors
                        .filter(err => err?.location === 'parLevel')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
                  <Form.Group>
                     <Form.Label
                        title="maxInventoryLevel"
                        htmlFor="maxInventoryLevel"
                     >
                        <Flex container alignItems="center">
                           {t(address.concat('max inventory level'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_maxLevel_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="maxInventoryLevel"
                        name="max inventory level"
                        placeholder="Max Inventory Level"
                        value={maxValue}
                        onChange={e => setMaxValue(e.target.value)}
                        onBlur={e => handleErrors(e, 'maxInventoryLevel')}
                     />
                     {errors
                        .filter(err => err?.location === 'maxInventoryLevel')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>

            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label>
                        <Flex container alignItems="center">
                           Select Unit
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_select_unit_formselect" />
                        </Flex>
                     </Form.Label>
                     <Form.Select
                        options={units}
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                     />
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>

            <StyledRow>
               <StyledLabel>
                  <Flex container alignItems="center">
                     {t(address.concat('processing information'))}
                     <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_processingInformation_section" />
                  </Flex>
               </StyledLabel>
            </StyledRow>
            {bulkItem?.id && (
               <StyledRow>
                  {bulkItem?.image ? (
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
                        <img src={bulkItem.image} alt="processing" />
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
                  <Form.Group>
                     <Form.Label htmlFor="labourTime">
                        <Flex container alignItems="center">
                           {t(address.concat('labour time per 100gm'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_labor_time_form_field" />
                        </Flex>
                     </Form.Label>
                     <Form.TextSelect>
                        <Form.Number
                           id="labourTime"
                           name="labor time"
                           placeholder="Labour Time"
                           value={laborTime}
                           onChange={e => setLaborTime(e.target.value)}
                           onBlur={e => handleErrors(e, 'laboutTime')}
                        />
                        <Form.Select
                           options={[
                              { id: 0, title: t('units.hours') },
                              { id: 1, title: t('units.minutes') },
                           ]}
                           defaultValue={laborUnit}
                           onChange={e => setLaborUnit(e.target.value)}
                        />
                     </Form.TextSelect>
                     {errors
                        .filter(err => err?.location === 'labourTime')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
                  <Form.Group>
                     <Form.Label title="percentageYield" htmlFor="yield">
                        <Flex container alignItems="center">
                           {t(address.concat('percentage of yield'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_yield_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="yield"
                        name="yield"
                        placeholder="Yield (in %)"
                        value={yieldPercentage}
                        onChange={e => setYieldPercentage(e.target.value)}
                        onBlur={e => handleErrors(e, 'yield')}
                     />
                     {errors
                        .filter(err => err?.location === 'yield')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label htmlFor="shelfLife" title="Shelf Life">
                        <Flex container alignItems="center">
                           {t(address.concat('shelf life'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_shelfLife_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.TextSelect>
                        <Form.Number
                           id="shelfLife"
                           name="shelf life"
                           placeholder="Shelf Life"
                           value={shelfLife}
                           onChange={e => setShelfLife(e.target.value)}
                           onBlur={e => handleErrors(e, 'shelfLife')}
                        />
                        <Form.Select
                           name="unit"
                           options={[
                              { id: 0, title: t('units.hours') },
                              { id: 1, title: t('units.minutes') },
                           ]}
                           defaultValue={shelfLifeUnit}
                           onChange={e => setShelfLifeUnit(e.target.value)}
                        />
                     </Form.TextSelect>
                     {errors
                        .filter(err => err?.location === 'shelfLife')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
                  <Form.Group>
                     <Form.Label title="Bulk Density" htmlFor="bulkDensity">
                        <Flex container alignItems="center">
                           {t(address.concat('bulk dnesity'))}
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_bulkDensity_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="bulkDensity"
                        type="number"
                        name="bulk density"
                        placeholder="Bulk Density"
                        value={bulkDensity}
                        onChange={e => setBulkDensity(e.target.value)}
                        onblur={e => handleErrors(e, 'bulkDensity')}
                     />
                     {errors
                        .filter(err => err?.location === 'bulkDensity')
                        .map(error => (
                           <Form.Error key={error.location}>
                              {error.message}
                           </Form.Error>
                        ))}
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow style={{ marginBottom: '0' }}>
               <StyledLabel
                  style={{
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'space-between',
                  }}
               >
                  <Flex container alignItems="center">
                     {t(address.concat('nutritions per 100gm'))}
                     <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_nutrition_section" />
                  </Flex>
                  <IconButton
                     onClick={() => {
                        openNutritionTunnel(1)
                     }}
                     type="ghost"
                  >
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </StyledLabel>
            </StyledRow>
            <NutrientView
               bulkItemId={bulkItem?.id || id}
               dispatch={() => {}}
               openNutritionTunnel={openNutritionTunnel}
            />
            <AllergensView
               openAllergensTunnel={openAllergensTunnel}
               bulkItemId={bulkItem?.id || id}
            />
         </TunnelBody>
      </>
   )
}

function NutrientView({ bulkItemId, openNutritionTunnel }) {
   const { t } = useTranslation()
   const {
      data: { bulkItem: { nutritionInfo } = {} } = {},
   } = useSubscription(NUTRITION_INFO, { variables: { id: bulkItemId } })

   if (nutritionInfo && Object.keys(nutritionInfo).length)
      return <Nutrition data={nutritionInfo} />

   return (
      <ButtonTile
         type="secondary"
         text={t(address.concat('add nutritions'))}
         onClick={() => {
            openNutritionTunnel(1)
         }}
      />
   )
}

function AllergensView({ openAllergensTunnel, bulkItemId }) {
   const { t } = useTranslation()

   const {
      data: { bulkItem: { allergens = [] } = {} } = {},
   } = useSubscription(NUTRITION_INFO, { variables: { id: bulkItemId } })

   const renderContent = () => {
      if (allergens?.length)
         return (
            <Highlight pointer onClick={() => openAllergensTunnel(1)}>
               <TagGroup>
                  {allergens.map(el => (
                     <Tag key={el.id}> {el.title} </Tag>
                  ))}
               </TagGroup>
            </Highlight>
         )

      return (
         <ButtonTile
            type="secondary"
            text={t(address.concat('add allergens'))}
            onClick={() => openAllergensTunnel(1)}
         />
      )
   }

   return (
      <>
         <br />
         <StyledRow>
            <StyledLabel>
               <Flex container alignItems="center">
                  {t(address.concat('allergens'))}
                  <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_allergens_section" />
               </Flex>
            </StyledLabel>
            {renderContent()}
         </StyledRow>
      </>
   )
}
