import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Tunnel, Tunnels, useTunnel, Text } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
import { toast } from 'react-toastify'
import {
   reducers,
   SimpleProductContext,
   state as initialState,
} from '../../../../context/product/simpleProduct'
import { Context } from '../../../../context/tabs'
import {
   INVENTORY_PRODUCTS,
   RECIPES,
   SIMPLE_RECIPE_PRODUCTS,
   S_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../graphql'
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { Description, Recipe } from './components'
import {
   AccompanimentTypeTunnel,
   DescriptionTunnel,
   PriceConfigurationTunnel,
   ProductsTunnel,
   ProductsTypeTunnel,
   RecipeTunnel,
} from './tunnels'

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
         console.log(updatedRecipes)
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

   //Handlers
   const updateName = () => {
      if (title) {
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  name: title,
               },
            },
         })
      }
   }

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
                  state={state}
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
                     onBlur={updateName}
                  />
               </div>
               <MasterSettings>
                  {state.isValid?.status ? (
                     <React.Fragment>
                        <TickIcon color="#00ff00" stroke={2} />
                        <Text as="p">All good!</Text>
                     </React.Fragment>
                  ) : (
                     <React.Fragment>
                        <CloseIcon color="#ff0000" />
                        <Text as="p">{state.isValid?.error}</Text>
                     </React.Fragment>
                  )}
               </MasterSettings>
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
