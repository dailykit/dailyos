import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Spacer } from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { PRODUCT } from '../../../../../graphql'
import validator from '../../validators'

const Pricing = ({ state }) => {
   const [updated, setUpdated] = React.useState(null)
   const [history, setHistory] = React.useState({
      price: state.price,
      discount: state.discount,
   })
   const [price, setPrice] = React.useState({
      value: state.price,
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [discount, setDiscount] = React.useState({
      value: state.discount,
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })

   React.useEffect(() => {
      setPrice({ ...price, value: state.price })
      setDiscount({ ...discount, value: state.discount })
      setHistory({
         price: state.price,
         discount: state.discount,
      })
   }, [state.price, state.discount])

   const [updatePrice, { loading: updatingPrice }] = useMutation(
      PRODUCT.UPDATE,
      {
         onCompleted: () => {
            setUpdated('price')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [updateDiscount, { loading: updatingDiscount }] = useMutation(
      PRODUCT.UPDATE,
      {
         onCompleted: () => {
            setUpdated('discount')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const isActuallyUpdated = (field, value) => {
      if (history[field] !== value) {
         return true
      }
      return false
   }

   const handleBlur = field => {
      switch (field) {
         case 'price': {
            const val = price.value
            const { isValid, errors } = validator.price(val)
            if (isValid && isActuallyUpdated(field, val)) {
               updatePrice({
                  variables: {
                     id: state.id,
                     _set: {
                        price: val ? val : 0,
                     },
                  },
               })
            }
            setPrice({
               ...price,
               meta: {
                  isTouched: true,
                  isValid,
                  errors,
               },
            })
            return
         }
         case 'discount': {
            const val = discount.value
            const { isValid, errors } = validator.discount(val)
            if (isValid && isActuallyUpdated(field, val)) {
               updateDiscount({
                  variables: {
                     id: state.id,
                     _set: {
                        discount: val ? val : 0,
                     },
                  },
               })
            }
            setDiscount({
               ...discount,
               meta: {
                  isTouched: true,
                  isValid,
                  errors,
               },
            })
            return
         }
         default:
            return null
      }
   }

   return (
      <Flex>
         <Flex container alignItems="center">
            <Form.Stepper
               id="price"
               name="price"
               width="100px"
               fieldName="Price:"
               textBefore="$"
               onBlur={() => handleBlur('price')}
               onChange={val => setPrice({ ...price, value: val })}
               value={price.value}
               placeholder="0"
               hasError={price.meta.isTouched && !price.meta.isValid}
            />
            <Spacer xAxis size="16px" />

            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="price"
               loading={updatingPrice}
            />
         </Flex>
         <Spacer yAxis size="48px" />
         <Flex container alignItems="center">
            <Form.Stepper
               id="discount"
               name="discount"
               width="100px"
               fieldName="Discount:"
               unitText="%"
               onBlur={() => handleBlur('discount')}
               onChange={value => setDiscount({ ...discount, value })}
               value={discount.value}
               placeholder="Enter discount"
               hasError={discount.meta.isTouched && !discount.meta.isValid}
            />
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="discount"
               loading={updatingDiscount}
            />
         </Flex>
         <Spacer yAxis size="48px" />
      </Flex>
   )
}

export default Pricing
