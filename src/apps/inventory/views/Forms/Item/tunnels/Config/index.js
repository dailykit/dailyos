// TODO: handle unit error handling

import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   IconButton,
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
import { EditIcon } from '../../../../../../../shared/assets/icons'
import {
   InlineLoader,
   NutritionTunnel,
   Tooltip,
} from '../../../../../../../shared/components'
import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import { logger } from '../../../../../../../shared/utils'
import { ERROR_UPDATING_BULK_ITEM } from '../../../../../constants/errorMessages'
import { BULK_ITEM_UPDATED } from '../../../../../constants/successMessages'
import {
   NUTRITION_INFO,
   UNITS_SUBSCRIPTION,
   UPDATE_BULK_ITEM,
} from '../../../../../graphql'
import { validators } from '../../../../../utils/validators'
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

export default function ConfigTunnel({ close, proc: bulkItem = {}, id }) {
   const { t } = useTranslation()
   const [units, setUnits] = useState([])

   const [parLevel, setParLevel] = useState({
      value: bulkItem?.parLevel || '',
      meta: { isValid: !!bulkItem?.parLevel, isTouched: false, errors: [] },
   })
   const [maxValue, setMaxValue] = useState({
      value: bulkItem?.maxLevel || '',
      meta: { isValid: !!bulkItem?.maxLevel, isTouched: false, errors: [] },
   })
   const [unit, setUnit] = useState({
      value: bulkItem?.unit,
      meta: { isValid: !!bulkItem?.unit, isTouched: false, errors: [] },
   })
   const [laborTime, setLaborTime] = useState({
      value: bulkItem?.labor?.value || '',
      meta: { isValid: !!bulkItem?.labor?.value, isTouched: false, errors: [] },
   })
   const [laborUnit, setLaborUnit] = useState({
      value: bulkItem?.labor?.unit || '',
      meta: { isValid: !!bulkItem?.labor?.unit, isTouched: false, errors: [] },
   })
   const [yieldPercentage, setYieldPercentage] = useState({
      value: bulkItem?.yield?.value || '',
      meta: { isValid: !!bulkItem?.yield?.value, isTouched: false, errors: [] },
   })
   const [shelfLife, setShelfLife] = useState({
      value: bulkItem?.shelfLife?.value || '',
      meta: {
         isValid: !!bulkItem?.shelfLife?.value,
         isTouched: false,
         errors: [],
      },
   })
   const [shelfLifeUnit, setShelfLifeUnit] = useState({
      value: bulkItem?.shelfLife?.unit,
      meta: {
         isValid: !!bulkItem?.shelfLife?.unit,
         isTouched: false,
         errors: [],
      },
   })
   const [bulkDensity, setBulkDensity] = useState({
      value: bulkItem?.bulkDensity || '',
      meta: { isValid: !!bulkItem?.bulkDensity, isTouched: false, errors: [] },
   })

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
         logger(error)
         toast.error(ERROR_UPDATING_BULK_ITEM)
         close(1)
      },
   })

   const checkValidation = () => {
      if (!parLevel.value || !parLevel.meta.isValid)
         return 'invalid par level value'
      if (!maxValue.value || !maxValue.meta.isValid)
         return 'invalid max. inventory level value'
      if (!unit.value) return 'unit is required'
      return true
   }

   const handleSave = () => {
      const validationMessage = checkValidation()
      console.log(unit, laborUnit, shelfLifeUnit)

      if (!validationMessage.length) {
         const allergens = bulkItem.allergens
         udpateBulkItem({
            variables: {
               id: id || bulkItem.id,
               object: {
                  unit: unit.value, // string
                  yield: {
                     value: yieldPercentage.meta.isValid
                        ? yieldPercentage.value
                        : '',
                  },
                  shelfLife: {
                     unit: shelfLifeUnit.meta.value ? shelfLifeUnit.value : '',
                     value: shelfLife.meta.isValid ? shelfLife.value : '',
                  },
                  parLevel: +parLevel.value,
                  maxLevel: +maxValue.value,
                  labor: {
                     value: laborTime.meta.isValid ? laborTime.value : '',
                     unit: laborUnit.value ? laborUnit.value : '',
                  },
                  bulkDensity: bulkDensity.meta.isValid
                     ? +bulkDensity.value
                     : null,
                  allergens: allergens?.length ? allergens : [],
               },
            },
         })
         close(1)
      } else {
         toast.error(validationMessage)
      }
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

   if (loading) return <InlineLoader />

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
            right={{
               title: loading ? 'Saving...' : t(address.concat('save')),
               action: handleSave,
            }}
         />

         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label title="parLevel" htmlFor="parLevel">
                        <Flex container alignItems="center">
                           {t(address.concat('set par level'))}*
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_parLevel_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="parLevel"
                        placeholder="Par Level..."
                        name="par level"
                        value={parLevel.value}
                        onChange={e =>
                           setParLevel({
                              value: e.target.value,
                              meta: { ...parLevel.meta },
                           })
                        }
                        onBlur={e => {
                           const { errors, isValid } = validators.quantity(
                              e.target.value
                           )
                           setParLevel({
                              value: e.target.value,
                              meta: { isValid, errors, isTouched: true },
                           })
                        }}
                     />
                     {parLevel.meta.isTouched && !parLevel.meta.isValid && (
                        <Form.Error>{parLevel.meta.errors[0]}</Form.Error>
                     )}
                  </Form.Group>
                  <Form.Group>
                     <Form.Label
                        title="maxInventoryLevel"
                        htmlFor="maxInventoryLevel"
                     >
                        <Flex container alignItems="center">
                           {t(address.concat('max inventory level'))}*
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_maxLevel_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Number
                        id="maxInventoryLevel"
                        name="max inventory level"
                        placeholder="Max Inventory Level"
                        value={maxValue.value}
                        onChange={e =>
                           setMaxValue({
                              value: e.target.value,
                              meta: { ...maxValue.meta },
                           })
                        }
                        onBlur={e => {
                           const { errors, isValid } = validators.quantity(
                              e.target.value
                           )
                           setMaxValue({
                              value: e.target.value,
                              meta: { isValid, isTouched: true, errors },
                           })
                        }}
                     />
                     {maxValue.meta.isTouched && !maxValue.meta.isValid && (
                        <Form.Error>{maxValue.meta.errors[0]}</Form.Error>
                     )}
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>

            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label htmlFor="units" title="SelectUnit">
                        <Flex container alignItems="center">
                           Select Unit*
                           <Tooltip identifier="supplier_item_form_add_bulk_item_tunnel_select_unit_formselect" />
                        </Flex>
                     </Form.Label>
                     <Form.Select
                        name="units"
                        id="units"
                        // FIXME: change this...
                        options={[{ id: 0, title: 'Select unit' }, ...units]}
                        value={unit.value}
                        onChange={e =>
                           setUnit({
                              value: e.target.value,
                              meta: { ...unit.meta },
                           })
                        }
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
                     <Form.Label htmlFor="labourTime" title="labourTime">
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
                           value={laborTime.value}
                           onChange={e =>
                              setLaborTime({
                                 value: e.target.value,
                                 meta: { ...laborTime.meta },
                              })
                           }
                           onBlur={e => {
                              const { errors, isValid } = validators.quantity(
                                 e.target.value
                              )
                              setLaborTime({
                                 value: e.target.value,
                                 meta: { isValid, errors, isTouched: true },
                              })
                           }}
                        />
                        <Form.Select
                           name="time"
                           id="time"
                           options={[
                              { id: 1, title: t('units.hours') },
                              { id: 2, title: t('units.minutes') },
                           ]}
                           value={laborUnit.value}
                           onChange={e => setLaborUnit(e.target.value)}
                        />
                     </Form.TextSelect>
                     {laborTime.meta.isTouched && !laborTime.meta.isValid && (
                        <Form.Error>{laborTime.meta.errors[0]}</Form.Error>
                     )}
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
                        value={yieldPercentage.value}
                        onChange={e =>
                           setYieldPercentage({
                              value: e.target.value,
                              meta: { ...yieldPercentage.meta },
                           })
                        }
                        onBlur={e => {
                           const { errors, isValid } = validators.quantity(
                              e.target.value
                           )
                           setYieldPercentage({
                              value: e.target.value,
                              meta: { isValid, errors, isTouched: true },
                           })
                        }}
                     />
                     {yieldPercentage.meta.isTouched &&
                        !yieldPercentage.meta.isValid && (
                           <Form.Error>
                              {yieldPercentage.meta.errors[0]}
                           </Form.Error>
                        )}
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
                           value={shelfLife.value}
                           onChange={e =>
                              setShelfLife({
                                 value: e.target.value,
                                 meta: { ...shelfLife.meta },
                              })
                           }
                           onBlur={e => {
                              const { errors, isValid } = validators.quantity(
                                 e.target.value
                              )
                              setShelfLife({
                                 value: e.target.value,
                                 meta: { errors, isValid, isTouched: true },
                              })
                           }}
                        />
                        <Form.Select
                           id="unit"
                           name="unit"
                           options={[
                              { id: 1, title: t('units.hours') },
                              { id: 2, title: t('units.minutes') },
                           ]}
                           value={shelfLifeUnit}
                           onChange={e => setShelfLifeUnit(e.target.value)}
                        />
                     </Form.TextSelect>
                     {shelfLife.meta.isTouched && !shelfLife.meta.isValid && (
                        <Form.Error>{shelfLife.meta.errors[0]}</Form.Error>
                     )}
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
                        value={bulkDensity.value}
                        onChange={e =>
                           setBulkDensity({
                              value: e.target.value,
                              meta: { ...bulkDensity.meta },
                           })
                        }
                        onblur={e => {
                           const { errors, isValid } = validators.quantity(
                              e.target.value
                           )
                           setBulkDensity({
                              value: e.target.value,
                              meta: { errors, isValid, isTouched: true },
                           })
                        }}
                     />
                     {bulkDensity.meta.isTouched &&
                        !!bulkDensity.meta.isValid && (
                           <Form.Error>{bulkDensity.meta.errors[0]}</Form.Error>
                        )}
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
