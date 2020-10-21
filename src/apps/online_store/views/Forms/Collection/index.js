import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
   Form,
   Flex,
   Spacer,
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
import validator from '../validators'
import { logger } from '../../../../../shared/utils'

const address = 'apps.online_store.views.forms.collection.'

const CollectionForm = () => {
   const { t } = useTranslation()

   const { setTabTitle, tab, addTab } = useTabs()
   const { id: collectionId } = useParams()

   const [collectionState, collectionDispatch] = React.useReducer(
      reducer,
      initialState
   )

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [state, setState] = React.useState(undefined)

   // Subscription
   const { loading, error } = useSubscription(S_COLLECTION, {
      variables: {
         id: collectionId,
      },
      onSubscriptionData: data => {
         console.log(data.subscriptionData.data)
         setState(data.subscriptionData.data.collection)
         setTitle({
            ...title,
            value: data.subscriptionData.data.collection.name,
         })
      },
   })

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   // Mutations
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title.value)) {
         addTab(title.value, `/online-store/collections/${collectionId}`)
      }
   }, [tab, addTab, loading, title.value])

   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateCollection({
            variables: {
               id: state.id,
               set: {
                  name: title.value,
               },
            },
         })
         if (data) {
            setTabTitle(title.value)
         }
      }
      setTitle({
         ...title,
         meta: {
            isTouched: true,
            errors,
            isValid,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         {state ? (
            <CollectionContext.Provider
               value={{ collectionState, collectionDispatch }}
            >
               <Flex
                  as="header"
                  container
                  padding="16px 32px"
                  alignItems="start"
                  justifyContent="space-between"
               >
                  <Form.Group>
                     <Form.Label htmlFor="title" title="title">
                        Collection Name*
                     </Form.Label>
                     <Form.Text
                        id="title"
                        name="title"
                        value={title.value}
                        placeholder="Enter product name"
                        onChange={e =>
                           setTitle({ ...title, value: e.target.value })
                        }
                        onBlur={updateName}
                        hasError={!title.meta.isValid && title.meta.isTouched}
                     />
                     {title.meta.isTouched &&
                        !title.meta.isValid &&
                        title.meta.errors.map((error, index) => (
                           <Form.Error key={index}>{error}</Form.Error>
                        ))}
                  </Form.Group>
               </Flex>
               <Flex padding="16px 32px">
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
               </Flex>
            </CollectionContext.Provider>
         ) : (
            <p>Could not fetch collection!</p>
         )}
      </>
   )
}

export default CollectionForm
