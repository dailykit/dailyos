import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { Text, ButtonTile, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import {
   DELETE_COLLECTION_PRODUCT_CATEGORY_PRODUCT,
   DELETE_COLLECTION_PRODUCT_CATEGORY,
} from '../../../../../graphql'

import { CollectionContext } from '../../../../../context'
import {
   ProductsTunnel,
   ProductTypeTunnel,
   CategoriesTunnel,
} from '../../tunnels'

import { DeleteIcon } from '../../../../../assets/icons'
import {
   StyledCategoryWrapper,
   StyledHeader,
   StyledProductWrapper,
   Grid,
   ProductContent,
   ProductImage,
   ActionButton,
} from './styled'

const Products = ({ state }) => {
   const { collectionDispatch } = React.useContext(CollectionContext)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [categoryTunnels, openCategoryTunnel, closeCategoryTunnel] = useTunnel(
      1
   )

   const [deleteCollectionProductCategory] = useMutation(
      DELETE_COLLECTION_PRODUCT_CATEGORY,
      {
         onCompleted: data => {
            toast.success('Category removed!')
         },
         onError: error => {
            console.log(error)
            toast.error(error.message)
         },
      }
   )

   const addProduct = categoryId => {
      collectionDispatch({
         type: 'CATEGORY_ID',
         payload: {
            categoryId,
         },
      })
      openTunnel(1)
   }

   const deleteCategory = category => {
      try {
         const isConfirmed = window.confirm(
            `Are you sure you want to remove ${category.productCategoryName}?`
         )
         if (isConfirmed) {
            deleteCollectionProductCategory({
               variables: {
                  id: category.id,
               },
            })
         }
      } catch (err) {
         console.log(err)
         toast.error(err.message)
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductTypeTunnel
                  closeTunnel={closeTunnel}
                  openTunnel={openTunnel}
               />
            </Tunnel>
            <Tunnel>
               <ProductsTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={categoryTunnels}>
            <Tunnel layer={1}>
               <CategoriesTunnel
                  closeTunnel={closeCategoryTunnel}
                  state={state}
               />
            </Tunnel>
         </Tunnels>
         {state.productCategories.map(category => (
            <StyledCategoryWrapper key={category.id}>
               <StyledHeader>
                  <Text as="h2">{category.productCategoryName}</Text>
                  <ActionButton onClick={() => deleteCategory(category)}>
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
                     onClick={() => addProduct(category.id)}
                  />
               </Grid>
            </StyledCategoryWrapper>
         ))}
         <ButtonTile
            type="secondary"
            text="Add Category"
            onClick={() => openCategoryTunnel(1)}
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
