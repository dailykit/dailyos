import React from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   Input,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui'

// context
import {
   state as initialState,
   ComboProductContext,
   reducers,
} from '../../../../context/product/comboProduct'
import { Context } from '../../../../context/tabs'

// styles
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'

// graphql
import {
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCT,
   UPDATE_COMBO_PRODUCT,
} from '../../../../graphql'

// components
import { Description, Items } from './components'

// tunnels
import {
   DescriptionTunnel,
   ItemsTunnel,
   ProductTypeTunnel,
   ProductsTunnel,
} from './tunnels'

import { useTranslation, Trans } from 'react-i18next'
import { S_COMBO_PRODUCT } from '../../../../graphql/subscriptions'

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

   // Queries
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
      fetchPolicy: 'cache-and-network',
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
      fetchPolicy: 'cache-and-network',
   })
   useQuery(CUSTOMIZABLE_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.customizableProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            customizable: updatedProducts,
         })
      },
      fetchPolicy: 'cache-and-network',
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
