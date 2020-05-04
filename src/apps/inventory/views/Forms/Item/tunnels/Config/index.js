import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'

import {
   TextButton,
   Input,
   ButtonTile,
   Tag,
   TagGroup,
   Text,
   IconButton,
   Loader,
} from '@dailykit/ui'

// Mutations
import { CREATE_BULK_ITEM, ADD_BULK_ITEM } from '../../../../../graphql'

import { CloseIcon } from '../../../../../assets/icons'
import EditIcon from '../../../../../../recipe/assets/icons/Edit'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelHeader,
   TunnelBody,
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
   StyledSelect,
   StyledLabel,
} from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.config.'

export default function ConfigTunnel({ close, open }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ItemContext)
   const [loading, setLoading] = useState(false)

   const [addBulkItem] = useMutation(ADD_BULK_ITEM)
   const [createBulkItem] = useMutation(CREATE_BULK_ITEM)

   const handleSave = async () => {
      setLoading(true)
      const res = await createBulkItem({
         variables: {
            processingName: state.processing.name,
            itemId: state.id,
            unit: state.processing.par_level.unit,
            yield: { value: state.processing.yield },
            shelfLife: state.processing.shelf_life,
            parLevel: +state.processing.par_level.value,
            nutritionInfo: state.processing.nutrients || {},
            maxLevel: +state.processing.max_inventory_level.value,
            labor: state.processing.labor_time,
            bulkDensity: +state.processing.bulk_density,
            allergens: state.processing.allergens,
         },
      })

      if (res?.data?.createBulkItem) {
         const bulkItemAsShippedId = res?.data?.createBulkItem?.returning[0].id
         const result = await addBulkItem({
            variables: { itemId: state.id, bulkItemAsShippedId },
         })

         if (result?.data) {
            dispatch({ type: 'ADD_PROCESSING', payload: bulkItemAsShippedId })
            close(4)
            setLoading(false)
            toast.success('Bulk Item Added!')
         }
      }
   }

   if (loading) return <Loader />

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
                        value={state.processing.par_level.value}
                        onChange={e =>
                           dispatch({
                              type: 'PAR_LEVEL',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.par_level.unit}
                        onChange={e =>
                           dispatch({
                              type: 'PAR_LEVEL',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
                     >
                        <option value="gram">{t('units.gram')}</option>
                        <option value="loaf">{t('units.loaf')}</option>
                     </StyledSelect>
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('max inventory level'))}
                        name="max_inventory_level"
                        value={state.processing.max_inventory_level.value}
                        onChange={e =>
                           dispatch({
                              type: 'MAX_INVENTORY_LEVEL',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.max_inventory_level.unit}
                        onChange={e =>
                           dispatch({
                              type: 'MAX_INVENTORY_LEVEL',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
                     >
                        <option value="gms">{t('units.gms')}</option>
                        <option value="kgs">{t('units.kgs')}</option>
                     </StyledSelect>
                  </InputWrapper>
               </StyledInputGroup>
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
                           label={t(address.concat('labor time per 100gm'))}
                           name="labor_time"
                           value={state.processing.labor_time.value}
                           onChange={e =>
                              dispatch({
                                 type: 'LABOR_TIME',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.processing.labor_time.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'LABOR_TIME',
                                 payload: {
                                    name: 'unit',
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="hours">
                              {t(address.concat('hours'))}
                           </option>
                           <option value="minutes">
                              {t(address.concat('minutes'))}
                           </option>
                        </StyledSelect>
                     </InputWrapper>
                  )}
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('percentage of yield'))}
                        name="yield"
                        value={state.processing.yield}
                        onChange={e =>
                           dispatch({
                              type: 'YIELD',
                              payload: { value: e.target.value },
                           })
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
                        type="text"
                        label={t(address.concat('shelf life'))}
                        name="shelf_life"
                        value={state.processing.shelf_life.value}
                        onChange={e =>
                           dispatch({
                              type: 'SHELF_LIFE',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.shelf_life.unit}
                        onChange={e =>
                           dispatch({
                              type: 'SHELF_LIFE',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="days">{t('units.days')}</option>
                     </StyledSelect>
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('bulk density'))}
                        name="bulk_density"
                        value={state.processing.bulk_density}
                        onChange={e =>
                           dispatch({
                              type: 'BULK_DENSITY',
                              payload: { value: e.target.value },
                           })
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
                           {state.processing.nutrients?.cal}
                        </Text>

                        <Text as="title">
                           <strong>{t(address.concat('total fat'))}: </strong>
                           {state.processing.nutrients?.fat}
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
            {!state.form_meta.shipped && (
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
            )}
         </TunnelBody>
      </>
   )
}
