import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Context } from '../../../../../context/tabs'
import {
   UNITS_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'
import { StyledSelect } from '../../../styled'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'
import {
   Highlight,
   InputWrapper,
   StyledInputGroup,
   StyledRow,
   TunnelBody,
} from '../styled'

const address = 'apps.inventory.views.forms.item.tunnels.info.'

export default function InfoTunnel({ close, formState }) {
   const { t } = useTranslation()
   const { state, dispatch } = useContext(Context)
   const [units, setUnits] = useState([])

   const [itemName, setItemName] = useState(formState.name || '')
   const [sku, setSku] = useState(formState.sku || '')
   const [unitSize, setUnitSize] = useState(formState.unitSize || '')
   const [unit, setUnit] = useState(formState.unit || units[0]?.name)
   const [unitPrice, setUnitPrice] = useState(
      (formState.prices?.length && formState.prices[0].unitPrice.value) || ''
   )
   const [leadTime, setLeadTime] = useState(formState.leadTime?.value || '')
   const [leadTimeUnit, setLeadTimeUnit] = useState(
      formState.leadTime?.unit || 'days'
   )

   const [errors, setErrors] = useState([])

   const { loading: unitsLoading } = useSubscription(UNITS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.units
         setUnits(data)
      },
   })

   const [updateSupplierItem, { loading }] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: input => {
         const newName = input.updateSupplierItem.returning[0].name
         close()
         dispatch({
            type: 'SET_TITLE',
            payload: { title: newName, oldTitle: state.current.title },
         })
         toast.info('Item information updated')
      },
      onError: error => {
         console.log(error)
         toast.error('Error adding item information. Please try again')
         close()
      },
   })

   const handleNext = () => {
      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else {
         updateSupplierItem({
            variables: {
               id: formState.id,
               object: {
                  name: itemName,
                  sku,
                  unitSize: +unitSize,
                  unit,
                  prices: [{ unitPrice: { unit: '$', value: unitPrice } }],
                  leadTime: { unit: leadTimeUnit, value: leadTime },
               },
            },
         })
      }
   }

   if (loading || unitsLoading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('item information'))}
            close={close}
            right={{ title: t(address.concat('next')), action: handleNext }}
         />

         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Input
                     type="text"
                     label={t(address.concat('item name'))}
                     name="title"
                     value={itemName}
                     onChange={e => setItemName(e.target.value)}
                  />
                  <Input
                     type="text"
                     label={t(address.concat('item sku'))}
                     name="sku"
                     value={sku}
                     onChange={e => setSku(e.target.value)}
                  />
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <Highlight>
                  <StyledInputGroup>
                     <InputWrapper>
                        <Input
                           type="number"
                           label={t(address.concat('unit qty'))}
                           name="unit quantity"
                           value={unitSize}
                           onChange={e => setUnitSize(e.target.value)}
                           onBlur={e =>
                              handleNumberInputErrors(e, errors, setErrors)
                           }
                        />
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
                     </InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('unit price')).concat(':')}
                        name="Unit Price"
                        value={unitPrice}
                        onChange={e => setUnitPrice(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </StyledInputGroup>
               </Highlight>
            </StyledRow>
            {/* <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("case qty")).concat(':')}
                           name="case_quantity"
                           value={state.case_quantity.value}
                           onChange={e =>
                              dispatch({
                                 type: 'CASE',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.case_quantity.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'CASE',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="unit">{t(address.concat('unit'))}</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("minimum order value")).concat(':')}
                           name="minimum_order_value"
                           value={state.min_order_value.value}
                           onChange={e =>
                              dispatch({
                                 type: 'MIN_ORDER',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.min_order_value.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'MIN_ORDER',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="cs">{t('units.cs')}</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow> */}
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="number"
                           label={t(address.concat('lead time')).concat(':')}
                           name="Lead Time"
                           value={leadTime}
                           onChange={e => setLeadTime(e.target.value)}
                           onBlur={e =>
                              handleNumberInputErrors(e, errors, setErrors)
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={leadTimeUnit}
                           onChange={e => setLeadTimeUnit(e.target.value)}
                        >
                           <option value="days">
                              {t(address.concat('days'))}
                           </option>
                           <option value="weeks">
                              {t(address.concat('weeks'))}
                           </option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            {/* <StyledRow>
               <StyledLabel>
                  {t(
                     address.concat(
                        'upload cerificates for the item authentication (if any)'
                     )
                  )}
               </StyledLabel>
               <Highlight></Highlight>
            </StyledRow> */}
         </TunnelBody>
      </>
   )
}
