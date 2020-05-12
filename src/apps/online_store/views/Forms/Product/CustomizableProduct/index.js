import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
// context
import {
   CustomizableProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/customizableProduct'
import { Context } from '../../../../context/tabs'
// graphql
import {
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
   S_CUSTOMIZABLE_PRODUCT,
   UPDATE_CUSTOMIZABLE_PRODUCT,
} from '../../../../graphql'
// styles
import { StyledWrapper } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
// components
import { Description, Products } from './components'
// tunnels
import { DescriptionTunnel, ProductsTunnel, ProductTypeTunnel } from './tunnels'

const address = 'apps.online_store.views.forms.product.customizableproduct.'

export default function CustomizableProduct() {
   const { t } = useTranslation()

   const { state: tabs, dispatch } = React.useContext(Context)
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   const [products, setProducts] = React.useState({
      inventory: [],
      simple: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscription
   const { loading } = useSubscription(S_CUSTOMIZABLE_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.customizableProduct)
         setTitle(data.subscriptionData.data.customizableProduct.name)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })
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
   const [updatedProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
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
            payload: {
               oldTitle: tabs.current.title,
               title,
            },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   if (loading) return <Loader />

   return (
      <CustomizableProductContext.Provider
         value={{ productState, productDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  products={products[productState.meta.itemType]}
               />
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
                     onBlur={updatedProduct}
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
               <Products state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </CustomizableProductContext.Provider>
   )
}
