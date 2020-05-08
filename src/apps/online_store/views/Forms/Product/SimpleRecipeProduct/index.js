import React from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   Input,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui'

import { Context } from '../../../../context/tabs'
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
   S_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'
import { Tabs } from '../../../../components'

const address = 'apps.online_store.views.forms.product.simplerecipeproduct.'

export default function SimpleRecipeProduct() {
   const { t } = useTranslation()

   const { state: tabs, dispatch } = React.useContext(Context)
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

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
   // const [createSimpleRecipeProductOptions] = useMutation(
   //    CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
   //    {
   //       onCompleted: data => {
   //          console.log('Saved!')
   //          console.log(data.createSimpleRecipeProductOptions)
   //          toast.success('Product added!')
   //       },
   //    }
   // )
   // const [createSimpleRecipeProduct] = useMutation(
   //    CREATE_SIMPLE_RECIPE_PRODUCT,
   //    {
   //       onCompleted: data => {
   //          const productId = data.createSimpleRecipeProduct.returning[0].id
   //          saveOptions(productId)
   //       },
   //    }
   // )

   // Subscription
   const { loading } = useSubscription(S_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.simpleRecipeProduct)
         setTitle(data.subscriptionData.data.simpleRecipeProduct.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Subscription for fetching recipes
   useSubscription(RECIPES, {
      onSubscriptionData: data => {
         const { simpleRecipes } = data.subscriptionData.data
         const updatedRecipes = simpleRecipes.map(item => {
            item.title = item.name
            return item
         })
         setRecipes(updatedRecipes)
      },
   })

   // Subscription for fetching products
   useSubscription(SIMPLE_RECIPE_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.simpleRecipeProducts.map(
            pdct => {
               return {
                  ...pdct,
                  title: pdct.name,
               }
            }
         )
         setProducts({
            ...products,
            simple: updatedProducts,
         })
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(INVENTORY_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.inventoryProducts.map(
            pdct => {
               return {
                  ...pdct,
                  title: pdct.name,
               }
            }
         )
         setProducts({
            ...products,
            inventory: updatedProducts,
         })
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            name: title,
         },
      },
      onCompleted: () => {
         toast.success('Name updated!')
         dispatch({
            type: 'SET_TITLE',
            payload: { oldTitle: tabs.current.title, title },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   if (loading) return <Loader />

   return (
      <SimpleProductContext.Provider value={{ productState, productDispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <RecipeTunnel
                  state={state}
                  close={closeTunnel}
                  recipes={recipes}
               />
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
                  state={state}
                  close={closeTunnel}
                  products={products[productState.meta.productsType]}
               />
            </Tunnel>
            <Tunnel layer={6}>
               <PriceConfigurationTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label={t(address.concat('product name'))}
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={updateProduct}
                  />
               </div>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description state={state} openTunnel={openTunnel} />
                  </div>
                  <div></div>
               </StyledMeta>
               <StyledRule />
               <Recipe state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </SimpleProductContext.Provider>
   )
}
