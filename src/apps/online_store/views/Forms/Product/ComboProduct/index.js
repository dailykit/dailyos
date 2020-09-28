import React from 'react'
import { isEmpty } from 'lodash'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Text, Toggle, Checkbox } from '@dailykit/ui'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
// context
import {
   ComboProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/comboProduct'
import { useTabs } from '../../../../context'
// graphql
import { S_COMBO_PRODUCT, UPDATE_COMBO_PRODUCT } from '../../../../graphql'
// styles
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
// components
import { Description, Items, Assets } from './components'

const address = 'apps.online_store.views.forms.product.comboproduct.'

export default function ComboProduct() {
   const { t } = useTranslation()

   const { id: productId } = useParams()

   const { setTabTitle, tab, addTab } = useTabs()
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscriptions
   const { loading } = useSubscription(S_COMBO_PRODUCT, {
      variables: {
         id: productId,
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

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('updated!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error!')))
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title)) {
         addTab(title, `/online-store/combo-products/${productId}`)
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
      <ComboProductContext.Provider value={{ productState, productDispatch }}>
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
               <Items state={state} />
            </StyledBody>
         </StyledWrapper>
      </ComboProductContext.Provider>
   )
}
