import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
   Input,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

import {
   state as initialState,
   SimpleProductContext,
   reducers,
} from '../../../../context/product/simpleProduct'

import {
   RecipeTunnel,
   DescriptionTunnel,
   ProductsTypeTunnel,
   ProductsTunnel,
   AccompanimentTypeTunnel,
   PriceConfigurationTunnel,
} from './tunnels'
import { Recipe, Description } from './components'
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'
import {
   RECIPES,
   ACCOMPANIMENT_TYPES,
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CREATE_SIMPLE_RECIPE_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../../graphql'

export default function SimpleRecipeProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')
   const [recipes, setRecipes] = React.useState([])
   const [accompanimentTypes, setAccompanimentTypes] = React.useState([
      { id: 1, title: 'Beverages' },
      { id: 2, title: 'Salads' },
      { id: 3, title: 'Sweets' },
   ])
   const [products, setProducts] = React.useState({
      inventory: [],
      simple: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   useQuery(RECIPES, {
      onCompleted: data => {
         const { simpleRecipes } = data
         const updatedRecipes = simpleRecipes.map(item => {
            item.title = item.name
            return item
         })
         setRecipes(updatedRecipes)
      },
   })
   useQuery(SIMPLE_RECIPE_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.simpleRecipeProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            simple: updatedProducts,
         })
      },
   })
   useQuery(INVENTORY_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.inventoryProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            inventory: updatedProducts,
         })
      },
   })
   // useQuery(ACCOMPANIMENT_TYPES, {
   //    onCompleted: data => {
   //       const { accompanimentTypes } = data
   //       const updatedAccompanimentTypes = accompanimentTypes.map(item => {
   //          item.title = item.name
   //          return item
   //       })
   //       setAccompanimentTypes(updatedAccompanimentTypes)
   //    },
   // })
   const [createSimpleRecipeProductOptions] = useMutation(
      CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
      {
         onCompleted: data => {
            console.log('Saved!')
            console.log(data.createSimpleRecipeProductOptions)
         },
      }
   )
   const [createSimpleRecipeProduct] = useMutation(
      CREATE_SIMPLE_RECIPE_PRODUCT,
      {
         onCompleted: data => {
            const productId = data.createSimpleRecipeProduct.returning[0].id
            saveOptions(productId)
         },
      }
   )

   const saveOptions = productId => {
      const objects = Object.entries(state.options).map(([type, options]) => {
         return options.map(value => {
            return {
               isActive: value.isActive,
               price: [value.price],
               simpleRecipeYieldId: value.id,
               simpleRecipeProductId: productId,
               type,
            }
         })
      })
      createSimpleRecipeProductOptions({
         variables: {
            objects: objects.flat(),
         },
      })
   }

   const save = () => {
      console.log(state)
      const object = {
         accompaniments: state.accompaniments,
         // default: {
         //    type: state.default.type,
         //    id: state.default.value.id,
         // },
         description: state.description,
         name: state.title,
         simpleRecipeId: state.recipe.id,
         tags: state.tags,
      }
      createSimpleRecipeProduct({
         variables: {
            objects: [object],
         },
      })
   }

   return (
      <SimpleProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <RecipeTunnel close={closeTunnel} recipes={recipes} />
            </Tunnel>
            <Tunnel layer={3}>
               <AccompanimentTypeTunnel
                  close={closeTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <ProductsTypeTunnel open={openTunnel} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
               <ProductsTunnel
                  close={closeTunnel}
                  products={products[state.meta.productsType]}
               />
            </Tunnel>
            <Tunnel layer={6}>
               <PriceConfigurationTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label="Product Name"
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={e =>
                        dispatch({
                           type: 'TITLE',
                           payload: { value: e.target.value },
                        })
                     }
                  />
               </div>
               <div>
                  <TextButton
                     type="ghost"
                     style={{ margin: '0px 10px' }}
                     onClick={save}
                  >
                     Save
                  </TextButton>

                  <TextButton type="solid" style={{ margin: '0px 10px' }}>
                     Publish
                  </TextButton>
               </div>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description openTunnel={openTunnel} />
                  </div>
                  <div></div>
               </StyledMeta>
               <StyledRule />
               <Recipe openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </SimpleProductContext.Provider>
   )
}
