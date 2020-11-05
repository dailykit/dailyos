import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Flex, Form, Loader, Spacer, Text } from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import {
   IngredientContext,
   reducers,
   state as initialState,
} from '../../../context/ingredient'
import { S_INGREDIENT, UPDATE_INGREDIENT } from '../../../graphql'
import { Processings, Stats } from './components'
import validator from './validators'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../shared/components'

const IngredientForm = () => {
   const { setTabTitle, tab, addTab } = useTabs()
   const { id: ingredientId } = useParams()
   const [ingredientState, ingredientDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })
   const [category, setCategory] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })
   const [state, setState] = React.useState({})

   // Subscriptions
   const { loading, error } = useSubscription(S_INGREDIENT, {
      variables: {
         id: ingredientId,
      },
      onSubscriptionData: data => {
         console.log(data.subscriptionData.data)
         setState(data.subscriptionData.data.ingredient)
         setTitle({
            ...title,
            value: data.subscriptionData.data.ingredient.name,
         })
         setCategory({
            ...category,
            value: data.subscriptionData.data.ingredient.category || '',
         })
      },
   })

   // Mutations
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: () => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title.value)) {
         addTab(title.value, `/products/ingredients/${ingredientId}`)
      }
   }, [tab, loading, title.value, addTab])

   // Handlers
   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateIngredient({
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
   const updateCategory = () => {
      const { isValid, errors } = validator.name(category.value)
      if (isValid) {
         updateIngredient({
            variables: {
               id: state.id,
               set: {
                  category: category.value,
               },
            },
         })
      }
      setCategory({
         ...category,
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
         toast.error('Ingredient should be valid!')
      } else {
         updateIngredient({
            variables: {
               id: state.id,
               set: {
                  isPublished: val,
               },
            },
         })
      }
   }

   if (loading) return <InlineLoader />
   if (!loading && error) {
      toast.error('Failed to fetch Ingredient!')
      logger(error)
      return <ErrorState />
   }

   return (
      <IngredientContext.Provider
         value={{ ingredientState, ingredientDispatch }}
      >
         <>
            <Flex
               container
               padding="16px 32px"
               alignItems="start"
               justifyContent="space-between"
            >
               <Flex container alignItems="start">
                  <Form.Group>
                     <Form.Label htmlFor="title" title="title">
                        Ingredient Name*
                     </Form.Label>
                     <Form.Text
                        id="title"
                        name="title"
                        value={title.value}
                        placeholder="Enter ingredient name"
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
                  <Spacer xAxis size="16px" />
                  <Form.Group>
                     <Form.Label htmlFor="category" title="category">
                        Category
                     </Form.Label>
                     <Form.Text
                        id="category"
                        name="category"
                        value={category.value}
                        placeholder="Enter ingredient category"
                        onChange={e =>
                           setCategory({ ...category, value: e.target.value })
                        }
                        onBlur={updateCategory}
                        hasError={
                           !category.meta.isValid && category.meta.isTouched
                        }
                     />
                     {category.meta.isTouched &&
                        !category.meta.isValid &&
                        category.meta.errors.map((error, index) => (
                           <Form.Error key={index}>{error}</Form.Error>
                        ))}
                  </Form.Group>
               </Flex>
               <Flex container alignItems="center" height="100%">
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
                  <Form.Toggle
                     name="published"
                     value={state.isPublished}
                     onChange={togglePublish}
                  >
                     <Flex container alignItems="center">
                        Published
                        <Tooltip identifier="ingredient_publish" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </Flex>
            <Flex padding="32px" style={{ background: '#f3f3f3' }}>
               <Stats state={state} />
               <Spacer size="32px" />
               <Processings state={state} />
            </Flex>
         </>
      </IngredientContext.Provider>
   )
}

export default IngredientForm
