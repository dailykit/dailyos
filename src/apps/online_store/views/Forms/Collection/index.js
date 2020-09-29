import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
   Input,
   Loader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   CollectionContext,
   reducer,
   state as initialState,
} from '../../../context/collection'
import { useTabs } from '../../../context/tabs'
import { S_COLLECTION, UPDATE_COLLECTION } from '../../../graphql'
import { Products, Availability } from './components'
import { FormBody, FormHeader } from './styled'

const address = 'apps.online_store.views.forms.collection.'

const CollectionForm = () => {
   const { t } = useTranslation()

   const { setTitle: setTabTitle, tab, addTab } = useTabs()
   const { id: collectionId } = useParams()

   const [collectionState, collectionDispatch] = React.useReducer(
      reducer,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState(undefined)
   const [busy, setBusy] = React.useState(false)

   // Subscription
   const { loading } = useSubscription(S_COLLECTION, {
      variables: {
         id: collectionId,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.collection)
         setTitle(data.subscriptionData.data.collection.name)
      },
   })

   // Mutations
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: () => {
         setBusy(false)
         toast.success('Updated!')
         setTabTitle(title)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title)) {
         addTab(title, `/online-store/collections/${collectionId}`)
      }
   }, [tab, addTab, loading, title])

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
      <>
         {state ? (
            <CollectionContext.Provider
               value={{ collectionState, collectionDispatch }}
            >
               <FormHeader>
                  <Input
                     label={t(address.concat('collection name'))}
                     type="text"
                     name="title"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={updateName}
                     style={{ maxWidth: 400 }}
                  />
               </FormHeader>
               <FormBody>
                  <HorizontalTabs>
                     <HorizontalTabList>
                        <HorizontalTab>Products</HorizontalTab>
                        <HorizontalTab>Availability</HorizontalTab>
                        <HorizontalTab>Insights</HorizontalTab>
                     </HorizontalTabList>
                     <HorizontalTabPanels>
                        <HorizontalTabPanel>
                           <Products state={state} />
                        </HorizontalTabPanel>
                        <HorizontalTabPanel>
                           <Availability />
                        </HorizontalTabPanel>
                        <HorizontalTabPanel>
                           Insights coming soon!
                        </HorizontalTabPanel>
                     </HorizontalTabPanels>
                  </HorizontalTabs>
               </FormBody>
            </CollectionContext.Provider>
         ) : (
            <p>Could not fetch collection!</p>
         )}
      </>
   )
}

export default CollectionForm
