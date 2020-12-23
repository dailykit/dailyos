import React from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Flex, Form, Spacer, Text, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   InlineLoader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import {
   CustomizableProductContext,
   state,
} from '../../../../../../context/product/customizableProduct'
import {
   CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
   INVENTORY_PRODUCT_OPTIONS,
   SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../../../../graphql'
import validators from '../../../validators'
import { TunnelBody } from '../styled'
import { OptionWrapper } from './styled'

const ProductOptionsTunnel = ({ state, close }) => {
   const { productState } = React.useContext(CustomizableProductContext)
   const [options, setOptions] = React.useState([])

   const [
      fetchInventoryProductOptions,
      { loading: inventoryProductOptionsLoading },
   ] = useLazyQuery(INVENTORY_PRODUCT_OPTIONS, {
      onCompleted: data => {
         const updatedOptions = data.inventoryProductOptions.map(option => ({
            ...option,
            isSelected: false,
            price: {
               value: 0,
               meta: { isValid: true, isTouched: false, errors: [] },
            },
            discount: {
               value: 0,
               meta: { isValid: true, isTouched: false, errors: [] },
            },
         }))
         setOptions([...updatedOptions])
      },
      onError: error => {
         toast.error('Could not fetch options!')
         logger(error)
      },
   })

   const [
      fetchSimpleRecipeProductOptions,
      { loading: simpleRecipeProductOptionsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCT_OPTIONS, {
      onCompleted: data => {
         const updatedOptions = data.simpleRecipeProductOptions.map(option => ({
            ...option,
            isSelected: false,
            price: {
               value: 0,
               meta: { isValid: true, isTouched: false, errors: [] },
            },
            discount: {
               value: 0,
               meta: { isValid: true, isTouched: false, errors: [] },
            },
         }))
         setOptions([...updatedOptions])
      },
      onError: error => {
         toast.error('Could not fetch options!')
         logger(error)
      },
   })

   // Mutation
   const [createCustomizableProductOption, { loading: saving }] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
      {
         onCompleted: () => {
            toast.success('Product added!')
            close(3)
            close(2)
            close(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   React.useEffect(() => {
      if (productState.product.__typename === 'products_inventoryProduct') {
         fetchInventoryProductOptions({
            variables: {
               where: {
                  inventoryProductId: { _eq: productState.product.id },
                  isArchived: { _eq: false },
               },
            },
         })
      }
      if (productState.product.__typename === 'products_simpleRecipeProduct') {
         fetchSimpleRecipeProductOptions({
            variables: {
               where: {
                  simpleRecipeProductId: { _eq: productState.product.id },
                  isArchived: { _eq: false },
                  isActive: { _eq: true },
               },
            },
         })
      }
   }, [])

   const renderOptionName = option => {
      if (option.label) {
         return option.label
      } else {
         const serving =
            option.simpleRecipeYield.yield.label ||
            `${option.simpleRecipeYield.yield.serving} serving`
         const type = option.type === 'readyToEat' ? 'Ready to Eat' : 'Meal Kit'
         return `${type} | ${serving}`
      }
   }

   const updateOption = (optionId, field, value) => {
      const updatedOptions = options.map(option =>
         option.id === optionId
            ? field === 'isSelected'
               ? { ...option, [field]: value }
               : { ...option, [field]: { ...option[field], value } }
            : option
      )
      setOptions(updatedOptions)
   }

   const validate = (optionId, { name, value }) => {
      if (name.includes('price')) {
         const { isValid, errors } = validators.price(value)
         const updatedOptions = options.map(option =>
            option.id === optionId
               ? {
                    ...option,
                    price: {
                       ...option.price,
                       meta: { isValid, errors, isTouched: true },
                    },
                 }
               : option
         )
         setOptions(updatedOptions)
      }
      if (name.includes('discount')) {
         const { isValid, errors } = validators.discount(value)
         const updatedOptions = options.map(option =>
            option.id === optionId
               ? {
                    ...option,
                    discount: {
                       ...option.discount,
                       meta: { isValid, errors, isTouched: true },
                    },
                 }
               : option
         )
         setOptions(updatedOptions)
      }
   }

   const save = () => {
      try {
         const selectedOptions = options.filter(({ isSelected }) => isSelected)
         if (!selectedOptions.length) {
            throw Error('Select at least one option!')
         }
         const isEveryOptionValid = selectedOptions.every(
            ({ price, discount }) => price.meta.isValid && discount.meta.isValid
         )
         if (isEveryOptionValid) {
            const finalOptions = selectedOptions.map(
               ({ id, price, discount }) => ({
                  optionId: id,
                  price: +price.value,
                  discount: +discount.value,
               })
            )
            createCustomizableProductOption({
               variables: {
                  objects: [
                     {
                        customizableProductId: state.id,
                        inventoryProductId:
                           productState.meta.productType === 'inventory'
                              ? productState.product.id
                              : null,
                        simpleRecipeProductId:
                           productState.meta.productType === 'simple'
                              ? productState.product.id
                              : null,
                        options: finalOptions,
                     },
                  ],
               },
            })
         } else {
            throw Error('Selected options must be valid!')
         }
      } catch (err) {
         toast.error(err.message)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Select Options to Add"
            close={() => close(4)}
            tooltip={
               <Tooltip identifier="customizable_product_product_options_tunnel" />
            }
            right={{
               title: saving ? 'Adding...' : 'Add',
               action: () => !saving && save(),
            }}
         />
         <TunnelBody>
            {inventoryProductOptionsLoading ||
            simpleRecipeProductOptionsLoading ? (
               <InlineLoader />
            ) : (
               <>
                  {options.map(option => (
                     <OptionWrapper key={option.id}>
                        <Flex container alignItems="center">
                           <Form.Group>
                              <Form.Checkbox
                                 name={`option-${option.id}`}
                                 value={option.isSelected}
                                 onChange={() =>
                                    updateOption(
                                       option.id,
                                       'isSelected',
                                       !option.isSelected
                                    )
                                 }
                              />
                           </Form.Group>
                           <Flex>
                              <Text as="p">{renderOptionName(option)}</Text>
                              <Spacer size="4px" />
                              <Flex container>
                                 <Form.Group>
                                    <Form.Label
                                       htmlFor={`option-price-${option.id}`}
                                       title={`option-price-${option.id}`}
                                    >
                                       Price*
                                    </Form.Label>
                                    <Form.Number
                                       id={`option-price-${option.id}`}
                                       name={`option-price-${option.id}`}
                                       onChange={e =>
                                          updateOption(
                                             option.id,
                                             'price',
                                             e.target.value
                                          )
                                       }
                                       onBlur={e =>
                                          validate(option.id, e.target)
                                       }
                                       value={option.price.value}
                                       placeholder="Enter option price"
                                       hasError={
                                          option.price.meta.isTouched &&
                                          !option.price.meta.isValid
                                       }
                                    />
                                    {option.price.meta.isTouched &&
                                       !option.price.meta.isValid &&
                                       option.price.meta.errors.map(
                                          (error, index) => (
                                             <Form.Error key={index}>
                                                {error}
                                             </Form.Error>
                                          )
                                       )}
                                 </Form.Group>
                                 <Spacer xAxis size="16px" />
                                 <Form.Group>
                                    <Form.Label
                                       htmlFor={`option-discount-${option.id}`}
                                       title={`option-discount-${option.id}`}
                                    >
                                       Discount*
                                    </Form.Label>
                                    <Form.Number
                                       id={`option-discount-${option.id}`}
                                       name={`option-discount-${option.id}`}
                                       onChange={e =>
                                          updateOption(
                                             option.id,
                                             'discount',
                                             e.target.value
                                          )
                                       }
                                       onBlur={e =>
                                          validate(option.id, e.target)
                                       }
                                       value={option.discount.value}
                                       placeholder="Enter option discount"
                                       hasError={
                                          option.discount.meta.isTouched &&
                                          !option.discount.meta.isValid
                                       }
                                    />
                                    {option.discount.meta.isTouched &&
                                       !option.discount.meta.isValid &&
                                       option.discount.meta.errors.map(
                                          (error, index) => (
                                             <Form.Error key={index}>
                                                {error}
                                             </Form.Error>
                                          )
                                       )}
                                 </Form.Group>
                              </Flex>
                           </Flex>
                        </Flex>
                     </OptionWrapper>
                  ))}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ProductOptionsTunnel