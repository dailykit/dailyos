import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Text, Toggle } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
// context
import {
   CustomizableProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/customizableProduct'
import { Context } from '../../../../context/tabs'
// graphql
import {
   S_CUSTOMIZABLE_PRODUCT,
   UPDATE_CUSTOMIZABLE_PRODUCT,
} from '../../../../graphql'
// styles
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
// components
import { Description, Products } from './components'

const address = 'apps.online_store.views.forms.product.customizableproduct.'

export default function CustomizableProduct() {
   const { t } = useTranslation()

   const { state: tabs, dispatch } = React.useContext(Context)
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscription
   const { loading } = useSubscription(S_CUSTOMIZABLE_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.customizableProduct)
         setTitle(data.subscriptionData.data.customizableProduct.name)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('updated!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
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
         toast.error(t(address.concat('product should be valid!')))
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

   if (loading) return <Loader />

   return (
      <CustomizableProductContext.Provider
         value={{ productState, productDispatch }}
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
                           <Text as="p">{t(address.concat('all good!'))}</Text>
                        </>
                     ) : (
                        <>
                           <CloseIcon color="#ff0000" />
                           <Text as="p">{state.isValid?.error}</Text>
                        </>
                     )}
                  </div>
                  <div>
                     <Toggle
                        checked={state.isPublished}
                        setChecked={togglePublish}
                        label={t(address.concat('published'))}
                     />
                  </div>
               </MasterSettings>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description state={state} />
                  </div>
                  <div> </div>
               </StyledMeta>
               <StyledRule />
               <Products state={state} />
            </StyledBody>
         </StyledWrapper>
      </CustomizableProductContext.Provider>
   )
}
