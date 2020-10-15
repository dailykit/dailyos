import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
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
import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import { ItemContext } from '../../../../../context/item'
import {
   CREATE_BULK_ITEM,
   UNITS_SUBSCRIPTION,
   UPDATE_BULK_ITEM,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'
import AllergensTunnel from '../Allergens'
import NutritionTunnel from '../NutritionTunnel'
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

export default function ConfigTunnel({ close, formState }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ItemContext)
   const [errors, setErrors] = useState([])
   const [units, setUnits] = useState([])

   const bulkItem = formState.bulkItemAsShipped

   const [parLevel, setParLevel] = useState(bulkItem?.parLevel || '')
   const [maxValue, setMaxValue] = useState(bulkItem?.maxLevel || '')
   const [unit, setUnit] = useState(bulkItem?.unit || formState?.unit)
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

   const { loading: unitsLoading } = useSubscription(UNITS_SUBSCRIPTION, {
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

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         close(2)
         toast.success('Bulk Item as Shipped Added!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
         close(2)
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
            toast.error(error.message)
            close(2)
         },
      }
   )

   const [udpateBulkItem, { loading: updateBulkItemLoading }] = useMutation(
      UPDATE_BULK_ITEM,
      {
         onCompleted: () => {
            close(2)
            dispatch({
               type: 'SET_ACTIVE_PROCESSING',
               payload: {
                  ...formState.bulkItemAsShipped,
                  unit: unit || units[0]?.title, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +parLevel,
                  nutritionInfo: state.processing.nutrients,
                  maxLevel: +maxValue,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: state.processing.allergens,
               },
            })
            toast.success('Bulk Item updated successfully !')
         },
         onError: error => {
            console.log(error)
            toast.error('Error updating bulk item as shipped. Please try again')
            close(2)
         },
      }
   )

   const handleSave = () => {
      if (!parLevel || !maxValue)
         return toast.error('Please fill the form properly')

      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else if (formState.bulkItemAsShippedId) {
         const allergens = state.processing.allergens.length
            ? state.processing.allergens
            : bulkItem.allergens

         udpateBulkItem({
            variables: {
               id: formState.bulkItemAsShippedId,
               object: {
                  unit, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +parLevel,
                  nutritionInfo:
                     state.processing.nutrients || bulkItem.nutritionInfo || {},
                  maxLevel: +maxValue,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: allergens?.length ? allergens : [],
               },
            },
         })
      } else {
         const allergens = state.processing.allergens.length
            ? state.processing.allergens
            : bulkItem?.allergens
         createBulkItem({
            variables: {
               processingName: state.processing.title,
               itemId: formState.id,
               unit, // string
               yield: { value: yieldPercentage },
               shelfLife: { unit: shelfLifeUnit, value: shelfLife },
               parLevel: +parLevel,
               nutritionInfo:
                  state.processing.nutrients || bulkItem.nutritionInfo || {},
               maxLevel: +maxValue,
               labor: { value: laborTime, unit: laborUnit },
               bulkDensity: +bulkDensity,
               allergens: allergens?.length ? allergens : [],
            },
         })
      }
   }

   if (createBulkItemLoading || updateBulkItemLoading || unitsLoading)
      return <Loader />

   return (
      <>
         <Tunnels tunnels={allergensTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <AllergensTunnel close={() => closeAllergensTunnel(1)} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={nutritionTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <NutritionTunnel
                  close={closeNutritionTunnel}
                  bulkItemId={bulkItem?.id}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={photoTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <PhotoTunnel close={closePhotoTunnel} bulkItem={bulkItem} />
            </Tunnel>
         </Tunnels>

         <TunnelHeader
            title={t(address.concat('configure processing'))}
            close={() => close(2)}
            right={{ title: t(address.concat('save')), action: handleSave }}
         />

         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label title="parLevel" htmlFor="parLevel">
                        {t(address.concat('set par level'))}
                     </Form.Label>
                     <Form.Number
                        id="parLevel"
                        placeholder="Par Level..."
                        name="par level"
                        value={+parLevel}
                        onChange={e => setParLevel(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label
                        title="maxInventoryLevel"
                        htmlFor="maxInventoryLevel"
                     >
                        {t(address.concat('max inventory level'))}
                     </Form.Label>
                     <Form.Number
                        id="maxInventoryLevel"
                        name="max inventory level"
                        placeholder="Max Inventory Level"
                        value={+maxValue}
                        onChange={e => setMaxValue(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>

            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label>Select Unit</Form.Label>
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
                  {t(address.concat('processing information'))}
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
                        {t(address.concat('labour time per 100gm'))}
                     </Form.Label>
                     <Form.TextSelect>
                        <Form.Number
                           id="labourTime"
                           name="labor time"
                           placeholder="Labour Time"
                           value={+laborTime}
                           onChange={e => setLaborTime(e.target.value)}
                           onBlur={e =>
                              handleNumberInputErrors(e, errors, setErrors)
                           }
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
                  </Form.Group>
                  <Form.Group>
                     <Form.Label title="percentageYield" htmlFor="yield">
                        {t(address.concat('percentage of yield'))}
                     </Form.Label>
                     <Form.Number
                        id="yield"
                        name="yield"
                        placeholder="Yield (in %)"
                        value={+yieldPercentage}
                        onChange={e => setYieldPercentage(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </Form.Group>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label htmlFor="shelfLife" title="Shelf Life">
                        {t(address.concat('shelf life'))}
                     </Form.Label>
                     <Form.TextSelect>
                        <Form.Number
                           id="shelfLife"
                           name="shelf life"
                           placeholder="Shelf Life"
                           value={+shelfLife}
                           onChange={e => setShelfLife(e.target.value)}
                           onBlur={e =>
                              handleNumberInputErrors(e, errors, setErrors)
                           }
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
                  </Form.Group>
                  <Form.Group>
                     <Form.Label title="Bulk Density" htmlFor="bulkDensity">
                        {t(address.concat('bulk dnesity'))}
                     </Form.Label>
                     <Form.Number
                        id="bulkDensity"
                        type="number"
                        name="bulk density"
                        placeholder="Bulk Density"
                        value={+bulkDensity}
                        onChange={e => setBulkDensity(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
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
                  <div>{t(address.concat('nutritions per 100gm'))}</div>
                  <IconButton
                     onClick={() => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'processing',
                        })
                        openNutritionTunnel(1)
                     }}
                     type="ghost"
                  >
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </StyledLabel>
            </StyledRow>
            <NutrientView
               bulkItem={bulkItem}
               dispatch={dispatch}
               openNutritionTunnel={openNutritionTunnel}
            />
            <AllergensView
               openAllergensTunnel={openAllergensTunnel}
               bulkItem={bulkItem}
            />
         </TunnelBody>
      </>
   )
}

function NutrientView({ bulkItem, openNutritionTunnel }) {
   const { t } = useTranslation()
   const {
      state: { processing: { nutrients } = {} },
      dispatch,
   } = React.useContext(ItemContext)

   if (nutrients) return <Nutrition data={nutrients} />
   else if (
      bulkItem?.nutritionInfo &&
      Object.keys(bulkItem?.nutritionInfo).length
   )
      return <Nutrition data={bulkItem.nutritionInfo} />

   return (
      <ButtonTile
         type="secondary"
         text={t(address.concat('add nutritions'))}
         onClick={() => {
            dispatch({
               type: 'SET_NUTRI_TARGET',
               payload: 'processing',
            })
            openNutritionTunnel(1)
         }}
      />
   )
}

function AllergensView({ openAllergensTunnel, bulkItem }) {
   const { t } = useTranslation()
   const { state } = React.useContext(ItemContext)

   const renderContent = () => {
      if (state.processing.allergens.length)
         return (
            <Highlight pointer onClick={() => openAllergensTunnel(1)}>
               <TagGroup>
                  {state.processing.allergens.map(el => (
                     <Tag key={el.id}> {el.title} </Tag>
                  ))}
               </TagGroup>
            </Highlight>
         )
      else if (bulkItem?.allergens?.length)
         return (
            <Highlight pointer onClick={() => openAllergensTunnel(1)}>
               <TagGroup>
                  {bulkItem.allergens.map(el => (
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
            <StyledLabel>{t(address.concat('allergens'))}</StyledLabel>
            {renderContent()}
         </StyledRow>
      </>
   )
}
