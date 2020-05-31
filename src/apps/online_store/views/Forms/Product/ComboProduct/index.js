import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Input,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   Toggle,
} from '@dailykit/ui'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
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
import {
   S_COMBO_PRODUCT,
   S_CUSTOMIZABLE_PRODUCTS,
   S_SIMPLE_RECIPE_PRODUCTS,
   S_INVENTORY_PRODUCTS,
} from '../../../../graphql'
// styles
import { StyledWrapper, MasterSettings } from '../../styled'
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
   useSubscription(S_CUSTOMIZABLE_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.customizableProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
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
      onError: error => {
         console.log(error)
      },
   })

   //Mutations
   const [updateProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      onCompleted: data => {
         toast.success(t(address.concat('updated!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error!')))
      },
   })

   // Handlers
   const updateName = async () => {
      if (title) {
         const { data } = await updateProduct({
            variables: {
               id: state.id,
               set: {
                  name: title,
               },
            },
         })
         if (data) {
            dispatch({
               type: 'SET_TITLE',
               payload: { oldTitle: tabs.current.title, title },
            })
         }
      }
   }
   const togglePublish = val => {
      if (val && !state.isValid.status) {
         return toast.error(t(address.concat('product should be valid!')))
      }
      updateProduct({
         variables: {
            id: state.id,
            set: {
               isPublished: val,
            },
         },
      })
   }

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
                     onBlur={updateName}
                  />
               </div>
               <MasterSettings>
                  <div>
                     {state.isValid?.status ? (
                        <React.Fragment>
                           <TickIcon color="#00ff00" stroke={2} />
                           <Text as="p">{t(address.concat('all good!'))}</Text>
                        </React.Fragment>
                     ) : (
                           <React.Fragment>
                              <CloseIcon color="#ff0000" />
                              <Text as="p">{state.isValid?.error}</Text>
                           </React.Fragment>
                        )}
                  </div>
                  <div>
                     <Toggle
                        checked={state.isPublished}
                        setChecked={togglePublish}
                        label={t(address.concat("published"))}
                     />
                  </div>
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
               <Items state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </ComboProductContext.Provider>
   )
}
