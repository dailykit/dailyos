import React from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import {
   Input,
   TextButton,
   Tunnels,
   Tunnel,
   useTunnel,
   Loader,
} from '@dailykit/ui'

import {
   CollectionContext,
   state as initialState,
   reducer,
} from '../../../context/collection'
import { ChevronRight } from '../../../assets/icons'
import {
   FormHeader,
   FormHeaderInputs,
   FormHeaderActions,
   Breadcrumbs,
   FormBody,
} from './styled'
import { Categories, Configuration } from './components'
import { ProductsTunnel, ProductTypeTunnel } from './tunnels'
import {
   CREATE_COLLECTION,
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCTS,
   UPDATE_COLLECTION,
   S_COLLECTION,
} from '../../../graphql'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { Context } from '../../../context/tabs'

const address = 'apps.online_store.views.forms.collection.'

const CollectionForm = () => {
   const { t } = useTranslation()

   const { state: tabs, dispatch } = React.useContext(Context)
   const [collectionState, collectionDispatch] = React.useReducer(
      reducer,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   const [products, setProducts] = React.useState({
      simple: [],
      inventory: [],
      customizable: [],
      combo: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   // Subscription
   const { loading } = useSubscription(S_COLLECTION, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.menuCollection)
         setTitle(data.subscriptionData.data.menuCollection.name)
         collectionDispatch({
            type: 'SEED',
            payload: data.subscriptionData.data.menuCollection,
         })
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
   })
   useSubscription(COMBO_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.comboProducts.map(
            pdct => {
               return {
                  ...pdct,
                  title: pdct.name,
               }
            }
         )
         setProducts({
            ...products,
            combo: updatedProducts,
         })
      },
   })

   // Mutations
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: data => {
         toast.success('Updated!')
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

   // Handlers
   const save = () => {
      const updateCategories = collectionState.categories.map(category => {
         const cat = {
            name: category.title,
            comboProducts: [],
            customizableProducts: [],
            simpleRecipeProducts: [],
            inventoryProducts: [],
         }
         category.products.forEach(product => {
            if (product.__typename === 'onlineStore_simpleRecipeProduct')
               cat.simpleRecipeProducts.push(product.id)
            else if (product.__typename === 'onlineStore_comboProduct')
               cat.comboProducts.push(product.id)
            else if (product.__typename === 'onlineStore_inventoryProduct')
               cat.inventoryProducts.push(product.id)
            else cat.customizableProducts.push(product.id)
         })
         return cat
      })
      const object = {
         availability: {
            rule: collectionState.rule,
            time: {
               end: '23:59',
               start: '00:00',
            },
         },
         categories: updateCategories,
         name: state.title,
         store: collectionState.categories,
      }
      updateCollection({
         variables: {
            id: state.id,
            set: {
               ...object,
            },
         },
      })
   }

   const updateName = () => {
      updateCollection({
         variables: {
            id: state.id,
            set: {
               name: title,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <CollectionContext.Provider
         value={{ collectionState, collectionDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel
                  close={closeTunnel}
                  products={products[collectionState.meta.productType]}
               />
            </Tunnel>
         </Tunnels>
         <FormHeader>
            <FormHeaderInputs>
               <Input
                  label={t(address.concat('collection name'))}
                  type="text"
                  name="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={updateName}
               />
               <Breadcrumbs>
                  <span
                     className={collectionState.stage >= 1 ? 'active' : ''}
                     onClick={() =>
                        collectionDispatch({ type: 'STAGE', payload: 1 })
                     }
                  >
                     {t(address.concat('add products'))}
                  </span>
                  <span>
                     <ChevronRight />
                  </span>
                  <span
                     className={collectionState.stage >= 2 ? 'active' : ''}
                     onClick={() =>
                        collectionDispatch({ type: 'STAGE', payload: 2 })
                     }
                  >
                     {t(address.concat('configure shop'))}
                  </span>
               </Breadcrumbs>
            </FormHeaderInputs>
            <FormHeaderActions>
               <TextButton type="outline" onClick={save}>
                  {t(address.concat('save'))}
               </TextButton>
               <TextButton
                  type="solid"
                  onClick={() =>
                     collectionDispatch({ type: 'STAGE', payload: 2 })
                  }
                  hidden={collectionState.stage === 2}
               >
                  {t(address.concat('proceed'))}
               </TextButton>
            </FormHeaderActions>
         </FormHeader>
         <FormBody>
            {collectionState.stage === 1 ? (
               <Categories openTunnel={openTunnel} />
            ) : (
               <Configuration />
            )}
         </FormBody>
      </CollectionContext.Provider>
   )
}

export default CollectionForm
