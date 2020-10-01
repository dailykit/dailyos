import React from 'react'
import { isEmpty } from 'lodash'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Text, Toggle, Checkbox } from '@dailykit/ui'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
import {
   reducers,
   SimpleProductContext,
   state as initialState,
} from '../../../../context/product/simpleProduct'
import {
   reducers as modifiersReducers,
   ModifiersContext,
   state as initialModifiersState,
} from '../../../../context/product/modifiers'
import { useTabs } from '../../../../context'
import {
   S_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../graphql'
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { Description, Recipe, Assets } from './components'

const address = 'apps.online_store.views.forms.product.simplerecipeproduct.'

export default function SimpleRecipeProduct() {
   const { t } = useTranslation()

   const { id: productId } = useParams()

   const { setTabTitle, tab, addTab } = useTabs()
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )
   const [modifiersState, modifiersDispatch] = React.useReducer(
      modifiersReducers,
      initialModifiersState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscription
   const { loading } = useSubscription(S_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: productId,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.simpleRecipeProduct)
         setTitle(data.subscriptionData.data.simpleRecipeProduct.name)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title)) {
         addTab(title, `/recipe/simple-recipe-products/${productId}`)
      }
   }, [tab, addTab, loading, title])

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
            setTabTitle(title)
         }
      }
   }
   const togglePublish = val => {
      if (val && !state.isValid.status) {
         toast.error('Product should be valid!')
         return
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
   const togglePopup = val => {
      return updateProduct({
         variables: {
            id: state.id,
            set: {
               isPopupAllowed: val,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <SimpleProductContext.Provider value={{ productState, productDispatch }}>
         <ModifiersContext.Provider
            value={{ modifiersState, modifiersDispatch }}
         >
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
                           <>
                              <TickIcon color="#00ff00" stroke={2} />
                              <Text as="p">All good!</Text>
                           </>
                        ) : (
                           <>
                              <CloseIcon color="#ff0000" />
                              <Text as="p">{state.isValid?.error}</Text>
                           </>
                        )}
                     </div>
                     <div>
                        <Checkbox
                           id="label"
                           checked={state.isPopupAllowed}
                           onChange={togglePopup}
                        >
                           Popup Allowed
                        </Checkbox>
                        <Toggle
                           checked={state.isPublished}
                           setChecked={togglePublish}
                           label="Published"
                        />
                     </div>
                  </MasterSettings>
               </StyledHeader>
               <StyledBody>
                  <StyledMeta>
                     <div>
                        <Description state={state} />
                     </div>
                     <div>
                        <Assets state={state} />
                     </div>
                  </StyledMeta>
                  <StyledRule />
                  <Recipe state={state} />
               </StyledBody>
            </StyledWrapper>
         </ModifiersContext.Provider>
      </SimpleProductContext.Provider>
   )
}
