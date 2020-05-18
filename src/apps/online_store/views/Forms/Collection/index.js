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
import { ChevronRight } from '../../../assets/icons'
import {
   CollectionContext,
   reducer,
   state as initialState,
} from '../../../context/collection'
import { Context } from '../../../context/tabs'
import {
   S_COLLECTION,
   UPDATE_COLLECTION,
   S_COMBO_PRODUCTS,
   S_CUSTOMIZABLE_PRODUCTS,
   S_INVENTORY_PRODUCTS,
   S_SIMPLE_RECIPE_PRODUCTS,
} from '../../../graphql'
import { Categories, Configuration } from './components'
import {
   Breadcrumbs,
   FormBody,
   FormHeader,
   FormHeaderActions,
   FormHeaderInputs,
} from './styled'
import { ProductsTunnel, ProductTypeTunnel } from './tunnels'

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
   const [busy, setBusy] = React.useState(false)

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
   useSubscription(S_COMBO_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.comboProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
               return {
                  ...pdct,
                  title: pdct.name,
               }
            })
         setProducts({
            ...products,
            combo: updatedProducts,
         })
      },
   })

   // Mutations
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: data => {
         setBusy(false)
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
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
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
      if (title) {
         updateCollection({
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
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
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
