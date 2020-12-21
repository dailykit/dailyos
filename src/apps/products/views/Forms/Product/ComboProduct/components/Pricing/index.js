import React from 'react'
import { Form, Spacer } from '@dailykit/ui'
import { Wrapper } from './styled'
import validator from '../../../validators'

const Pricing = ({ updateProduct, state }) => {
   const [price, setPrice] = React.useState({
      value: state.price?.value,
      meta: { isValid: true, isTouched: false, errors: [] },
   })
   const [discount, setDiscount] = React.useState({
      value: state.price?.discount,
      meta: { isValid: true, isTouched: false, errors: [] },
   })

   React.useEffect(() => {
      setPrice({ ...price, value: state.price?.value || '' })
      setDiscount({ ...discount, value: state.price?.discount || '' })
   }, [state.price])

   const validateAndUpdate = React.useCallback(() => {
      const { isValid: isPriceValid, errors: priceErrors } = validator.price(
         price.value
      )
      const {
         isValid: isDiscountValid,
         errors: discountErrors,
      } = validator.discount(discount.value)
      if (isPriceValid && isDiscountValid) {
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  price: {
                     value: +price.value,
                     discount: +discount.value,
                  },
               },
            },
         })
      }
      setPrice({
         ...price,
         meta: {
            isValid: isPriceValid,
            isTouched: true,
            errors: priceErrors,
         },
      })
      setDiscount({
         ...discount,
         meta: {
            isValid: isDiscountValid,
            isTouched: true,
            errors: discountErrors,
         },
      })
   }, [price, discount])

   return (
      <Wrapper>
         <Form.Group>
            <Form.Label htmlFor="price" title="price">
               Base Price*
            </Form.Label>
            <Form.Number
               id="price"
               name="price"
               onChange={e => setPrice({ ...price, value: e.target.value })}
               onBlur={validateAndUpdate}
               value={price.value}
               placeholder="Enter base price"
               hasError={price.meta.isTouched && !price.meta.isValid}
            />
            {price.meta.isTouched &&
               !price.meta.isValid &&
               price.meta.errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
         </Form.Group>
         <Spacer size="16px" />
         <Form.Group>
            <Form.Label htmlFor="discount" title="discount">
               Discount*
            </Form.Label>
            <Form.Number
               id="discount"
               name="discount"
               onChange={e =>
                  setDiscount({ ...discount, value: e.target.value })
               }
               onBlur={validateAndUpdate}
               value={discount.value}
               placeholder="Enter discount"
               hasError={discount.meta.isTouched && !discount.meta.isValid}
            />
            {discount.meta.isTouched &&
               !discount.meta.isValid &&
               discount.meta.errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
         </Form.Group>
      </Wrapper>
   )
}

export default Pricing
