import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Tunnel, Tunnels, useTunnel, Text } from '@dailykit/ui'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
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
   S_CUSTOMIZABLE_PRODUCT,
   UPDATE_CUSTOMIZABLE_PRODUCT,
   S_SIMPLE_RECIPE_PRODUCTS,
   S_INVENTORY_PRODUCTS,
} from '../../../../graphql'
// styles
import { StyledWrapper, MasterSettings } from '../../styled'
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
   // Subscription for fetching products
   useSubscription(S_SIMPLE_RECIPE_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.simpleRecipeProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
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
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(S_INVENTORY_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.inventoryProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
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
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
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
               <Products state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </CustomizableProductContext.Provider>
   )
}
