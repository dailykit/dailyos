import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Spacer, Flex, TunnelHeader, Text } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION } from '../../../../../../graphql'
import { TunnelBody } from '../styled'
import { Tooltip } from '../../../../../../../../shared/components'
import validator from '../../../validators'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.priceconfigurationtunnel.'

const PriceConfigurationTunnel = ({ state, close }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [_state, _dispatch] = React.useReducer(reducer, initialState)

   // Mutation
   const [updateOption, { loading: inFlight }] = useMutation(
      UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
      {
         variables: {
            id: productState.edit.id,
            set: {
               isActive: _state.visibility.value,
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
         },
      }
   )

   // Handlers
   const save = () => {
      if (inFlight) return
      if (!_state.visibility.value && productState.edit.id === state.default) {
         toast.error('Default option cannot be hidden!')
      } else {
         if (_state.price.meta.isValid && _state.discount.meta.isValid) {
            updateOption()
         } else {
            toast.error('Invalid values!')
         }
      }
   }

   React.useEffect(() => {
      if (productState.edit) {
         const seedState = {
            visibility: {
               value: productState.edit.isActive,
            },
            price: {
               value: productState.edit.price[0].value,
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
            discount: {
               value: productState.edit.price[0].discount,
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
            title={t(address.concat('configure pricing for serving'))}
            right={{
               action: save,
               title: inFlight
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <Flex container alignItems="start">
               <Flex container alignItems="center" width="120px">
                  <Text as="p">
                     {productState.edit.type === 'mealKit'
                        ? t(address.concat('meal kit'))
                        : t(address.concat('ready to eat'))}
                  </Text>
                  <Text as="subtitle">
                     x{productState.edit.simpleRecipeYield.yield.serving}
                  </Text>
               </Flex>
               <Spacer xAxis size="16px" />
               <Form.Checkbox
                  name="visibility"
                  value={_state.visibility.value}
                  onChange={() =>
                     _dispatch({
                        type: 'SET_VALUE',
                        payload: {
                           field: 'visibility',
                           value: !_state.visibility.value,
                        },
                     })
                  }
               >
                  <Flex container alignItems="center">
                     Visibility
                     <Tooltip identifier="simple_recipe_product_option_visibility" />
                  </Flex>
               </Form.Checkbox>
               <Spacer xAxis size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="price" title="price">
                     <Flex container alignItems="center">
                        Price*
                        <Tooltip identifier="simple_recipe_product_option_price" />
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
                        <Tooltip identifier="simple_recipe_product_option_discount" />
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

export default PriceConfigurationTunnel

const initialState = {
   visibility: {
      value: true,
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
