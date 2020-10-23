import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Flex, Form, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { useTabs } from '../../../../../context'
import {
   UNITS_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'
import { Highlight, StyledInputGroup, TunnelBody } from '../styled'

const address = 'apps.inventory.views.forms.item.tunnels.info.'

export default function InfoTunnel({ close, formState }) {
   const { t } = useTranslation()
   const { setTabTitle } = useTabs()
   const [units, setUnits] = useState([])

   const [itemName, setItemName] = useState(formState.name || '')
   const [sku, setSku] = useState(formState.sku || '')
   const [unitSize, setUnitSize] = useState(formState.unitSize || '')
   const [unit, setUnit] = useState(formState.unit)
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
         setTabTitle(newName)
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
                  unit: unit || units[0]?.title,
                  prices: [{ unitPrice: { unit: '$', value: unitPrice } }],
                  leadTime: { unit: leadTimeUnit, value: leadTime },
               },
            },
         })
      }
   }

   if (loading || unitsLoading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('item information'))}
            close={close}
            right={{ title: 'Save', action: handleNext }}
         />

         <TunnelBody>
            <Flex margin="0 0 32px 0">
               <StyledInputGroup>
                  <Form.Group>
                     <Form.Label title="title" htmlFor="title">
                        <Flex container alignItems="center">
                           {t(address.concat('item name'))}
                           <Tooltip identifier="supplieritem_form_itemname_formfield" />
                        </Flex>
                     </Form.Label>
                     <Form.Text
                        id="title"
                        name="title"
                        placeholder="Supplier Item Name..."
                        value={itemName}
                        onChange={e => setItemName(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label title="itemSku" htmlFor="sku">
                        <Flex container alignItems="center">
                           {t(address.concat('item sku'))}
                           <Tooltip identifier="supplieritem_form_item_sku_form_field" />
                        </Flex>
                     </Form.Label>
                     <Form.Text
                        id="sku"
                        name="sku"
                        placeholder="item sku..."
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                     />
                  </Form.Group>
               </StyledInputGroup>
            </Flex>
            <Flex margin="0 0 32px 0">
               <Highlight>
                  <StyledInputGroup>
                     <Form.Group>
                        <Form.Label title="unitQuantity" htmlFor="unitQuantity">
                           <Flex container alignItems="center">
                              {t(address.concat('unit qty'))}
                              <Tooltip identifier="supplieritem_form_unitquantity" />
                           </Flex>
                        </Form.Label>
                        <Form.TextSelect>
                           <Form.Number
                              id="unitQuantity"
                              name="unitQuantity"
                              placeholder="Unit Quantity..."
                              value={unitSize}
                              onChange={e => setUnitSize(e.target.value)}
                              onBlur={e =>
                                 handleNumberInputErrors(e, errors, setErrors)
                              }
                           />
                           <Form.Select
                              id="unit"
                              name="unit"
                              options={units}
                              value={unit}
                              onChange={e => setUnit(e.target.value)}
                           />
                        </Form.TextSelect>
                     </Form.Group>
                     <Form.Group>
                        <Form.Label title="unit price" htmlFor="unitPrice">
                           <Flex container alignItems="center">
                              {t(address.concat('unit price')).concat(':')}
                              <Tooltip identifier="supplieritem_form_item_unit_pric_form_field" />
                           </Flex>
                        </Form.Label>
                        <Form.Number
                           id="unitPrice"
                           name="Unit Price"
                           placeholder="Unit Price..."
                           value={+unitPrice}
                           onChange={e => setUnitPrice(e.target.value)}
                           onBlur={e =>
                              handleNumberInputErrors(e, errors, setErrors)
                           }
                        />
                     </Form.Group>
                  </StyledInputGroup>
               </Highlight>
            </Flex>
            <Flex margin="0 0 32px 0">
               <StyledInputGroup>
                  <Highlight>
                     <Form.Group>
                        <Form.Label title="Lead Time" htmlFor="leadTime">
                           <Flex container alignItems="center">
                              {t(address.concat('lead time')).concat(':')}
                              <Tooltip identifier="supplieritem_form_leadtime" />
                           </Flex>
                        </Form.Label>
                        <Form.TextSelect>
                           <Form.Number
                              id="leadTime"
                              name="Lead Time"
                              placeholder="Lead Time..."
                              value={+leadTime}
                              onChange={e => setLeadTime(e.target.value)}
                              onBlur={e =>
                                 handleNumberInputErrors(e, errors, setErrors)
                              }
                           />
                           <Form.Select
                              id="leadTimeUnit"
                              name="leadTimeUnit"
                              value={leadTimeUnit}
                              options={[
                                 { id: 0, title: t(address.concat('days')) },
                                 { id: 1, title: t(address.concat('weeks')) },
                              ]}
                              onChange={e => setLeadTimeUnit(e.target.value)}
                           />
                        </Form.TextSelect>
                     </Form.Group>
                  </Highlight>
               </StyledInputGroup>
            </Flex>
         </TunnelBody>
      </>
   )
}
