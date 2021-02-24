import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Collapsible,
   Flex,
   Form,
   IconButton,
   Spacer,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

import { ProductOptionTypeTunnel, ProductOptionItemTunnel } from './tunnels'
import { PRODUCT_OPTION } from '../../../../graphql'
import { logger } from '../../../../../../shared/utils'
import { PlusIcon } from '../../../../../../shared/assets/icons'
import { ProductContext } from '../../../../context/product'

const ProductOptions = ({ productId, options }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   const { productDispatch } = React.useContext(ProductContext)

   const [createProductOption] = useMutation(PRODUCT_OPTION.CREATE, {
      onCompleted: () => {
         toast.success('Option created.')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const handleAddOption = () => {
      createProductOption({
         variables: {
            object: {
               productId,
            },
         },
      })
   }

   const handleAddOptionItem = optionId => {
      productDispatch({
         type: 'OPTION',
         payload: optionId,
      })
      openTunnel(1)
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductOptionTypeTunnel
                  openTunnel={openTunnel}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductOptionItemTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {options.length && (
            <Flex margin="0 0 32px 0">
               {options.map(option => (
                  <Option
                     key={option.id}
                     option={option}
                     handleAddOptionItem={() => handleAddOptionItem(option.id)}
                  />
               ))}
            </Flex>
         )}
         <ButtonTile
            type="secondary"
            text="Add Option"
            onClick={handleAddOption}
         />
      </>
   )
}

export default ProductOptions

const Option = ({ option, handleAddOptionItem }) => {
   const [label, setLabel] = React.useState(option.label || '')
   const [quantity, setQuantity] = React.useState(option.quantity)
   const [price, setPrice] = React.useState(option.price)
   const [discount, setDiscount] = React.useState(option.discount)

   const renderHead = () => {
      return (
         <Flex container alignItems="center" width="100%">
            <Flex>
               <Form.Label htmlFor={`label-${option.id}`} title="label">
                  Label
               </Form.Label>
               <Form.Text
                  id={`label-${option.id}`}
                  name={`label-${option.id}`}
                  // onBlur={onBlur}
                  onChange={e => setLabel(e.target.value)}
                  value={label}
                  placeholder="Enter label"
                  // hasError={
                  //    state.username.meta.isTouched && !state.username.meta.isValid
                  // }
               />
            </Flex>
            <Spacer xAxis size="32px" />
            <Flex maxWidth="100px">
               <Form.Label htmlFor={`quantity-${option.id}`} title="quantity">
                  Quantity
               </Form.Label>
               <Form.Number
                  id={`quantity-${option.id}`}
                  name={`quantity-${option.id}`}
                  // onBlur={onBlur}
                  onChange={e => setQuantity(e.target.value)}
                  value={quantity}
                  placeholder="Enter quantity"
                  // hasError={
                  //    state.username.meta.isTouched && !state.username.meta.isValid
                  // }
               />
            </Flex>
            <Spacer xAxis size="32px" />
            <Flex maxWidth="100px">
               <Form.Label htmlFor={`price-${option.id}`} title="price">
                  Price
               </Form.Label>
               <Form.Number
                  id={`price-${option.id}`}
                  name={`price-${option.id}`}
                  // onBlur={onBlur}
                  onChange={e => setPrice(e.target.value)}
                  value={price}
                  placeholder="Enter price"
                  // hasError={
                  //    state.username.meta.isTouched && !state.username.meta.isValid
                  // }
               />
            </Flex>
            <Spacer xAxis size="32px" />
            <Flex maxWidth="100px">
               <Form.Label htmlFor={`discount-${option.id}`} title="discount">
                  Discount
               </Form.Label>
               <Form.Number
                  id={`discount-${option.id}`}
                  name={`discount-${option.id}`}
                  // onBlur={onBlur}
                  onChange={e => setDiscount(e.target.value)}
                  value={discount}
                  placeholder="Enter discount"
                  // hasError={
                  //    state.username.meta.isTouched && !state.username.meta.isValid
                  // }
               />
            </Flex>
            <Spacer xAxis size="64px" />
            <IconButton type="ghost" onClick={handleAddOptionItem}>
               <PlusIcon />
            </IconButton>
         </Flex>
      )
   }

   const renderBody = () => {
      return <p>Body</p>
   }

   return (
      <Collapsible
         isDraggable
         isHeadClickable
         head={renderHead()}
         body={renderBody()}
      />
   )
}
