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
   const deleteProduct = () => {
      try {
         const isConfirmed = window.confirm(
            `Are you sure you want to delete ${product.data.name}?`
         )
         if (isConfirmed) {
            console.log('Delete')
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
         <ActionButton onClick={deleteProduct}>
            <DeleteIcon color="#FF6B5E" />
         </ActionButton>
      </StyledProductWrapper>
   )
}
