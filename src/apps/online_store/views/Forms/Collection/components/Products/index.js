import React from 'react'
import { Text, ButtonTile } from '@dailykit/ui'

import { AddIcon, DeleteIcon } from '../../../../../assets/icons'
import {
   StyledCategoryWrapper,
   StyledHeader,
   StyledProductWrapper,
   Grid,
   ProductContent,
   ProductImage,
   ActionButton,
} from './styled'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_COLLECTION_PRODUCT_CATEGORY_PRODUCT } from '../../../../../graphql'

const Products = ({ state }) => {
   return (
      <>
         {state.productCategories.map(category => (
            <StyledCategoryWrapper key={category.id}>
               <StyledHeader>
                  <Text as="h2">{category.productCategoryName}</Text>
                  <ActionButton>
                     <DeleteIcon color="#FF6B5E" />
                  </ActionButton>
               </StyledHeader>
               <Grid>
                  {category.products.map(product => (
                     <Product key={product.id} product={product} />
                  ))}
                  <ButtonTile
                     type="secondary"
                     text="Add Product"
                     onClick={e => console.log('Tile clicked')}
                  />
               </Grid>
            </StyledCategoryWrapper>
         ))}
         <ButtonTile
            type="secondary"
            text="Add Category"
            onClick={e => console.log('Tile clicked')}
         />
      </>
   )
}

export default Products

const Product = ({ product }) => {
   const [deleteRecord] = useMutation(
      DELETE_COLLECTION_PRODUCT_CATEGORY_PRODUCT,
      {
         onCompleted: () => {
            toast.success('Product removed!')
         },
         onError: error => {
            throw Error(error)
         },
      }
   )

   const removeProduct = () => {
      try {
         const isConfirmed = window.confirm(
            `Are you sure you want to remove ${product.data.name}?`
         )
         if (isConfirmed) {
            deleteRecord({
               variables: {
                  id: product.id,
               },
            })
         }
      } catch (err) {
         console.log(err)
         toast.error(err.message)
      }
   }

   return (
      <StyledProductWrapper>
         <ProductContent>
            <ProductImage src={product.data.image} />
            <Text as="p"> {product.data.name} </Text>
         </ProductContent>
         <ActionButton onClick={removeProduct}>
            <DeleteIcon color="#FF6B5E" />
         </ActionButton>
      </StyledProductWrapper>
   )
}
