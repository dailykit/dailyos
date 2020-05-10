import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Input,
   Loader,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
// context
import {
   ComboProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/comboProduct'
import { Context } from '../../../../context/tabs'
// graphql
import {
   CUSTOMIZABLE_PRODUCTS,
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
   UPDATE_COMBO_PRODUCT,
} from '../../../../graphql'
import { S_COMBO_PRODUCT } from '../../../../graphql/subscriptions'
// styles
import { StyledWrapper } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
// components
import { Description, Items } from './components'
// tunnels
import {
   DescriptionTunnel,
   ItemsTunnel,
   ProductsTunnel,
   ProductTypeTunnel,
} from './tunnels'

const address = 'apps.online_store.views.forms.product.comboproduct.'

export default function ComboProduct() {
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
      customizable: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscriptions
   const { loading } = useSubscription(S_COMBO_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log('ComboProduct -> data', data)
         setState(data.subscriptionData.data.comboProduct)
         setTitle(data.subscriptionData.data.comboProduct.name)
      },
      onError: error => {
         console.log(error)
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
   useSubscription(CUSTOMIZABLE_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.customizableProducts.map(
            pdct => {
               return {
                  ...pdct,
                  title: pdct.name,
               }
            }
         )
         setProducts({
            ...products,
            customizable: updatedProducts,
         })
      },
      onError: error => {
         console.log(error)
      },
   })

   //Mutations
   const [updatedProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            name: title,
         },
      },
      onCompleted: data => {
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
      <ComboProductContext.Provider value={{ productState, productDispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemsTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={4}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  products={products[productState.meta.productType]}
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
               <div>
                  <TextButton type="ghost" style={{ margin: '0px 10px' }}>
                     {t(address.concat('save'))}
                  </TextButton>

                  <TextButton type="solid" style={{ margin: '0px 10px' }}>
                     {t(address.concat('publish'))}
                  </TextButton>
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
               <Items state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </ComboProductContext.Provider>
   )
}
