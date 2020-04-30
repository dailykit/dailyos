import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'

// Mutations
import { CREATE_SUPPLIER_ITEM } from '../../../../../graphql'

import { TextButton, Input, Loader } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

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

export default function InfoTunnel({ close, next }) {
   const { state, dispatch } = React.useContext(ItemContext)
   const [loading, setLoading] = useState(false)

   const [createSupplierItem] = useMutation(CREATE_SUPPLIER_ITEM)

   const handleNext = async () => {
      setLoading(true)

      if (
         !state.title ||
         !state.supplier.id ||
         !state.unit_quantity.value ||
         !state.unit_quantity.unit
      )
         return setLoading(false)

      const res = await createSupplierItem({
         variables: {
            name: state.title,
            supplierId: state.supplier.id,
            unit: state.unit_quantity.unit,
            unitSize: +state.unit_quantity.value,
         },
      })

      if (res?.data?.createSupplierItem) {
         setLoading(false)
         dispatch({
            type: 'ADD_ITEM_ID',
            payload: res?.data?.createSupplierItem?.returning[0]?.id,
         })
         close()
         next()
         toast.success('Item created!')
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>Item Information</span>
            </div>
            <div>
               <TextButton type="solid" onClick={handleNext}>
                  Next
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Input
                     type="text"
                     label="Item name"
                     name="title"
                     value={state.title}
                     onChange={e =>
                        dispatch({
                           type: 'TITLE',
                           payload: { title: e.target.value },
                        })
                     }
                  />
                  <Input
                     type="text"
                     label="Item SKU"
                     name="sku"
                     value={state.sku}
                     onChange={e =>
                        dispatch({
                           type: 'SKU',
                           payload: { sku: e.target.value },
                        })
                     }
                  />
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <Highlight>
                  <StyledInputGroup>
                     <InputWrapper>
                        <Input
                           type="text"
                           label="Unit qty:"
                           name="unit_quantity"
                           value={state.unit_quantity.value}
                           onChange={e =>
                              dispatch({
                                 type: 'QUANTITY',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.unit_quantity.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'QUANTITY',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="gram">gram</option>
                           <option value="loaf">loaf</option>
                        </StyledSelect>
                     </InputWrapper>
                     <Input
                        type="text"
                        label="Unit price:"
                        name="unit_price"
                        value={state.unit_price.unit + state.unit_price.value}
                        onChange={e =>
                           dispatch({
                              type: 'PRICE',
                              payload: {
                                 name: 'value',
                                 value: e.target.value.substring(1),
                              },
                           })
                        }
                     />
                  </StyledInputGroup>
               </Highlight>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label="Case qty:"
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
                           <option value="unit">unit</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label="Minimum order value:"
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
                           <option value="cs">cs</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label="Lead time:"
                           name="lead_time"
                           value={state.lead_time.value}
                           onChange={e =>
                              dispatch({
                                 type: 'LEAD_TIME',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.lead_time.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'LEAD_TIME',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="days">days</option>
                           <option value="weeks">weeks</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledLabel>
                  Upload cerificates for the item authentication (if any)
               </StyledLabel>
               <Highlight></Highlight>
            </StyledRow>
         </TunnelBody>
      </>
   )
}
