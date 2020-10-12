import React from 'react'
import * as Sentry from '@sentry/react'
import { isEmpty } from 'lodash'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { Input, Loader, Text, Toggle, Checkbox } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
import {
   InventoryProductContext,
   reducers,
   initialState,
} from '../../../../context/product/inventoryProduct'
import {
   reducers as modifiersReducers,
   ModifiersContext,
   state as initialModifiersState,
} from '../../../../context/product/modifiers'
import { useTabs } from '../../../../context'
import {
   S_INVENTORY_PRODUCT,
   UPDATE_INVENTORY_PRODUCT,
} from '../../../../graphql'
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { Description, Item, Assets } from './components'

const address = 'apps.online_store.views.forms.product.inventoryproduct.'

export default function InventoryProduct() {
   const { t } = useTranslation()
   const { id: productId } = useParams()

   // Context
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )
   const [modifiersState, modifiersDispatch] = React.useReducer(
      modifiersReducers,
      initialModifiersState
   )
   const { setTabTitle, tab, addTab } = useTabs()

   // State
   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscription
   const { loading } = useSubscription(S_INVENTORY_PRODUCT, {
      variables: {
         id: productId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.inventoryProduct)
         setTitle(data.subscriptionData.data.inventoryProduct.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title)) {
         addTab(title, `/recipe/inventory-products/${productId}`)
      }
   }, [tab, addTab, loading, title])

   // Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
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
            setTabTitle(title)
         }
      }
   }
   const togglePublish = val => {
      if (val && !state.isValid.status) {
         return toast.error('Product should be valid!')
      }
      return updateProduct({
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
      <Sentry.ErrorBoundary fallback={'An error has occured'}>
         <InventoryProductContext.Provider
            value={{ productState, productDispatch }}
         >
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
                        <div className="settings">
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
                     <Item state={state} />
                  </StyledBody>
               </StyledWrapper>
            </ModifiersContext.Provider>
         </InventoryProductContext.Provider>
      </Sentry.ErrorBoundary>
   )
}
