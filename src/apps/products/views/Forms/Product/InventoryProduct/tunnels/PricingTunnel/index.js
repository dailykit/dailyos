import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Spacer, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../shared/utils'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import {
   CREATE_INVENTORY_PRODUCT_OPTIONS,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
import validator from '../../../validators'
import { TunnelBody } from '../styled'
import { Tooltip } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.inventoryproduct.tunnels.pricingtunnel.'

const PricingTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const { productState } = React.useContext(InventoryProductContext)

   const [busy, setBusy] = React.useState(false)
   const [_state, _dispatch] = React.useReducer(reducer, initialState)

   // Mutations
   const [createOption] = useMutation(CREATE_INVENTORY_PRODUCT_OPTIONS, {
      variables: {
         objects: [
            {
               label: _state.label.value,
               quantity: +_state.quantity.value,
               price: [
                  {
                     value: +_state.price.value,
                     discount: +_state.discount.value,
                  },
               ],
               inventoryProductId: state.id,
            },
         ],
      },
      onCompleted: () => {
         toast.success('Option added!')
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
         setBusy(false)
      },
   })
   const [updateOption] = useMutation(UPDATE_INVENTORY_PRODUCT_OPTION, {
      variables: {
         id: productState.option?.id,
         set: {
            label: _state.label.value,
            quantity: +_state.quantity.value,
            price: [
               {
                  value: +_state.price.value,
                  discount: +_state.discount.value,
               },
            ],
         },
      },
      onCompleted: () => {
         toast.success('Option updated!')
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      if (
         _state.label.meta.isValid &&
         _state.quantity.meta.isValid &&
         _state.price.meta.isValid &&
         _state.discount.meta.isValid
      ) {
         if (productState.updating) updateOption()
         else createOption()
      } else {
         toast.error('Invalid values!')
         setBusy(false)
      }
   }

   React.useEffect(() => {
      if (productState.updating) {
         const seedState = {
            label: {
               value: productState.option.label,
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
            quantity: {
               value: productState.option.quantity,
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
            price: {
               value: productState.option.price[0].value,
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
            discount: {
               value: productState.option.price[0].discount,
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
         }
         _dispatch({
            type: 'SEED',
            payload: {
               state: seedState,
            },
         })
      }
   }, [])

   return (
      <>
         <TunnelHeader
            title={productState.updating ? 'Configure Option' : 'Add Option'}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <Flex container alignItems="start">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Label*
                        <Tooltip identifier="inventory_product_option_label" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="label"
                     name="label"
                     onBlur={e => {
                        const { isValid, errors } = validator.name(
                           _state.label.value
                        )
                        _dispatch({
                           type: 'SET_ERRORS',
                           payload: {
                              field: e.target.name,
                              meta: {
                                 isTouched: true,
                                 isValid,
                                 errors,
                              },
                           },
                        })
                     }}
                     onChange={e => {
                        _dispatch({
                           type: 'SET_VALUE',
                           payload: {
                              field: e.target.name,
                              value: e.target.value,
                           },
                        })
                     }}
                     value={_state.label.value}
                     placeholder="Enter label"
                     hasError={
                        _state.label.meta.isTouched &&
                        !_state.label.meta.isValid
                     }
                  />
                  {_state.label.meta.isTouched &&
                     !_state.label.meta.isValid &&
                     _state.label.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Spacer xAxis size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="quantity" title="quantity">
                     <Flex container alignItems="center">
                        Quantity*
                        <Tooltip identifier="inventory_product_option_quantity" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="quantity"
                     name="quantity"
                     onBlur={e => {
                        const { isValid, errors } = validator.quantity(
                           _state.quantity.value
                        )
                        _dispatch({
                           type: 'SET_ERRORS',
                           payload: {
                              field: e.target.name,
                              meta: {
                                 isTouched: true,
                                 isValid,
                                 errors,
                              },
                           },
                        })
                     }}
                     onChange={e => {
                        _dispatch({
                           type: 'SET_VALUE',
                           payload: {
                              field: e.target.name,
                              value: e.target.value,
                           },
                        })
                     }}
                     value={_state.quantity.value}
                     placeholder="Enter quantity"
                  />
                  {_state.quantity.meta.isTouched &&
                     !_state.quantity.meta.isValid &&
                     _state.quantity.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Spacer xAxis size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="price" title="price">
                     <Flex container alignItems="center">
                        Price*
                        <Tooltip identifier="inventory_product_option_price" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="price"
                     name="price"
                     onBlur={e => {
                        const { isValid, errors } = validator.price(
                           _state.price.value
                        )
                        _dispatch({
                           type: 'SET_ERRORS',
                           payload: {
                              field: e.target.name,
                              meta: {
                                 isTouched: true,
                                 isValid,
                                 errors,
                              },
                           },
                        })
                     }}
                     onChange={e => {
                        _dispatch({
                           type: 'SET_VALUE',
                           payload: {
                              field: e.target.name,
                              value: e.target.value,
                           },
                        })
                     }}
                     value={_state.price.value}
                     placeholder="Enter price"
                  />
                  {_state.price.meta.isTouched &&
                     !_state.price.meta.isValid &&
                     _state.price.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Spacer xAxis size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="discount" title="discount">
                     <Flex container alignItems="center">
                        Discount(%)*
                        <Tooltip identifier="inventory_product_option_discount" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="discount"
                     name="discount"
                     onBlur={e => {
                        const { isValid, errors } = validator.discount(
                           _state.discount.value
                        )
                        _dispatch({
                           type: 'SET_ERRORS',
                           payload: {
                              field: e.target.name,
                              meta: {
                                 isTouched: true,
                                 isValid,
                                 errors,
                              },
                           },
                        })
                     }}
                     onChange={e => {
                        _dispatch({
                           type: 'SET_VALUE',
                           payload: {
                              field: e.target.name,
                              value: e.target.value,
                           },
                        })
                     }}
                     value={_state.discount.value}
                     placeholder="Enter discount"
                  />
                  {_state.discount.meta.isTouched &&
                     !_state.discount.meta.isValid &&
                     _state.discount.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
            </Flex>
         </TunnelBody>
      </>
   )
}

export default PricingTunnel

const initialState = {
   label: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   quantity: {
      value: '1',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   price: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   discount: {
      value: '0',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
}

const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'SEED': {
         return {
            ...state,
            ...payload.state,
         }
      }
      case 'SET_VALUE': {
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               value: payload.value,
            },
         }
      }
      case 'SET_ERRORS': {
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               meta: payload.meta,
            },
         }
      }
      default:
         return state
   }
}
