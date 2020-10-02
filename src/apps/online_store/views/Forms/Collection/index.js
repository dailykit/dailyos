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

   const { setTabTitle, tab, addTab } = useTabs()
   const { id: collectionId } = useParams()

   const [collectionState, collectionDispatch] = React.useReducer(
      reducer,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState(undefined)

   // Subscription
   const { loading } = useSubscription(S_COLLECTION, {
      variables: {
         id: collectionId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.collection)
         setTitle(data.subscriptionData.data.collection.name)
      },
   })

   // Mutations
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(title)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title)) {
         addTab(title, `/online-store/collections/${collectionId}`)
      }
   }, [tab, addTab, loading, title])

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
                           <Availability state={state} />
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
