import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Loader, Text, Toggle, Flex, Form, Spacer } from '@dailykit/ui'
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import {
   state as initialState,
   reducers,
   RecipeContext,
} from '../../../context/recipe'

import { StyledWrapper, InputWrapper, MasterSettings } from '../styled'

import {
   Information,
   Procedures,
   Servings,
   Ingredients,
   Photo,
   RecipeCard,
} from './components'
import { UPDATE_RECIPE, S_RECIPE } from '../../../graphql'
import { logger } from '../../../../../shared/utils'
import validator from './validators'
import { Tooltip } from '../../../../../shared/components'

const RecipeForm = () => {
   // Context
   const { setTabTitle, tab, addTab } = useTabs()
   const { id: recipeId } = useParams()
   const [recipeState, recipeDispatch] = React.useReducer(
      reducers,
      initialState
   )

   // States
   const [state, setState] = React.useState({})

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })

   // Subscription
   const { loading } = useSubscription(S_RECIPE, {
      variables: {
         id: recipeId,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.simpleRecipe)
         setTitle({
            ...title,
            value: data.subscriptionData.data.simpleRecipe.name,
         })
      },
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
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
         addTab(title.value, `/recipe/recipes/${recipeId}`)
      }
   }, [tab, loading, title.value, addTab])

   // Handlers
   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateRecipe({
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
         toast.error('Recipe should be valid!')
      } else {
         updateRecipe({
            variables: {
               id: state.id,
               set: {
                  isPublished: val,
               },
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <RecipeContext.Provider value={{ recipeState, recipeDispatch }}>
         <>
            {/* View */}
            <Flex
               container
               justifyContent="space-between"
               alignItems="start"
               padding="16px 0"
               maxWidth="1280px"
               width="calc(100vw - 64px)"
               margin="0 auto"
               style={{ borderBottom: '1px solid #f3f3f3' }}
            >
               <Form.Group>
                  <Form.Label htmlFor="title" title="title">
                     Recipe Name*
                  </Form.Label>
                  <Form.Text
                     id="title"
                     name="title"
                     value={title.value}
                     placeholder="Enter recipe name"
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
                        <Tooltip identifier="recipe_publish" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </Flex>
            <Flex
               maxWidth="1280px"
               width="calc(100vw - 64px)"
               margin="0 auto"
               padding="32px 0"
            >
               {recipeState.stage === 0 ? (
                  <>
                     <Information state={state} />
                     <Spacer size="32px" />
                     <Photo state={state} />
                     <Spacer size="32px" />
                     <Servings state={state} />
                     <Spacer size="32px" />
                     <Ingredients state={state} />
                     <Spacer size="32px" />
                     <Procedures state={state} />
                  </>
               ) : (
                  <RecipeCard state={state} />
               )}
            </Flex>
         </>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
