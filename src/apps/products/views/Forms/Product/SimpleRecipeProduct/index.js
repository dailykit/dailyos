import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Flex, Form, Spacer, Text } from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../shared/components'
import { logger } from '../../../../../../shared/utils'
import { CloseIcon, TickIcon } from '../../../../assets/icons'
import { useTabs } from '../../../../context'
import {
   ModifiersContext,
   reducers as modifiersReducers,
   state as initialModifiersState,
} from '../../../../context/product/modifiers'
import {
   reducers,
   SimpleProductContext,
   state as initialState,
} from '../../../../context/product/simpleProduct'
import {
   S_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../graphql'
import { StyledRule } from '../styled'
import validator from '../validators'
import { Assets, Description, Recipe } from './components'

const address = 'apps.menu.views.forms.product.simplerecipeproduct.'

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

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [state, setState] = React.useState({})

   // Subscription
   const { loading, error } = useSubscription(S_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: productId,
      },
      onSubscriptionData: data => {
         console.log(data.subscriptionData.data)
         setState(data.subscriptionData.data.simpleRecipeProduct)
         setTitle({
            ...title,
            value: data.subscriptionData.data.simpleRecipeProduct.name,
         })
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
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
         addTab(title.value, `/products/simple-recipe-products/${productId}`)
      }
   }, [tab, addTab, loading, title.value])

   // Handlers
   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateProduct({
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
   const togglePublish = () => {
      const val = !state.isPublished
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
   const togglePopup = () => {
      const val = !state.isPopupAllowed
      return updateProduct({
         variables: {
            id: state.id,
            set: {
               isPopupAllowed: val,
            },
         },
      })
   }

   if (loading) return <InlineLoader />
   if (!loading && error) {
      toast.error('Failed to fetch Simple Recipe Product!')
      logger(error)
      return <ErrorState />
   }

   return (
      <SimpleProductContext.Provider value={{ productState, productDispatch }}>
         <ModifiersContext.Provider
            value={{ modifiersState, modifiersDispatch }}
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
                     Product Name*
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
               <Flex container alignItems="center">
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
                  <Spacer xAxis size="16px" />
                  <Form.Checkbox
                     name="popup"
                     value={state.isPopupAllowed}
                     onChange={togglePopup}
                  >
                     <Flex container alignItems="center">
                        Popup Allowed
                        <Tooltip identifier="simple_recipe_product_popup_checkbox" />
                     </Flex>
                  </Form.Checkbox>
                  <Spacer xAxis size="16px" />
                  <Form.Toggle
                     name="published"
                     value={state.isPublished}
                     onChange={togglePublish}
                  >
                     <Flex container alignItems="center">
                        Published
                        <Tooltip identifier="simple_recipe_product_publish" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </Flex>
            <Flex
               as="main"
               padding="32px"
               minHeight="calc(100vh - 130px)"
               style={{ background: '#f3f3f3' }}
            >
               <Flex as="section" container>
                  <Flex flex="2">
                     <Description state={state} />
                  </Flex>
                  <Spacer xAxis size="16px" />
                  <Flex flex="1">
                     <Assets state={state} />
                  </Flex>
               </Flex>
               <Spacer size="16px" />
               <StyledRule />
               <Spacer size="16px" />
               <Recipe state={state} />
            </Flex>
         </ModifiersContext.Provider>
      </SimpleProductContext.Provider>
   )
}
