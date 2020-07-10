import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Loader, Text, Toggle } from '@dailykit/ui'
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import {
   state as initialState,
   reducers,
   RecipeContext,
} from '../../../context/recipee'

import {
   StyledWrapper,
   StyledHeader,
   InputWrapper,
   MasterSettings,
   Flex,
} from '../styled'

import {
   Information,
   Procedures,
   Servings,
   Ingredients,
   Photo,
   RecipeCard,
} from './components'
import { UPDATE_RECIPE, S_RECIPE } from '../../../graphql'

const RecipeForm = () => {
   // Context
   const { state: tabs, dispatch } = React.useContext(Context)
   const [recipeState, recipeDispatch] = React.useReducer(
      reducers,
      initialState
   )

   // States
   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscription
   const { loading } = useSubscription(S_RECIPE, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.simpleRecipe)
         setTitle(data.subscriptionData.data.simpleRecipe.name)
      },
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: () => {
         toast.error('Error!')
      },
   })

   // Handlers
   const updateName = async () => {
      if (title) {
         const { data } = await updateRecipe({
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
         toast.error('Recipe should be valid!')
         return
      }
      updateRecipe({
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
      <RecipeContext.Provider value={{ recipeState, recipeDispatch }}>
         <>
            {/* View */}
            <StyledHeader>
               <Flex>
                  <InputWrapper>
                     <Input
                        type="text"
                        label="Recipe Title"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onBlur={updateName}
                     />
                  </InputWrapper>
                  {/* <BreadcrumbGroup>
                     <Breadcrumb
                        active={recipeState.stage >= 0}
                        onClick={() =>
                           recipeDispatch({ type: 'STAGE', payload: 0 })
                        }
                     >
                        Add Recipe
                     </Breadcrumb>
                     <ChevronRightIcon color=" #00a7e1" size={16} />
                     <Breadcrumb
                        active={recipeState.stage >= 1}
                        onClick={() =>
                           recipeDispatch({ type: 'STAGE', payload: 1 })
                        }
                     >
                        Recipe Card
                     </Breadcrumb>
                  </BreadcrumbGroup> */}
               </Flex>
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
                     <Toggle
                        checked={state.isPublished}
                        setChecked={togglePublish}
                        label="Published"
                     />
                  </div>
               </MasterSettings>
            </StyledHeader>
            <StyledWrapper width="980">
               {recipeState.stage === 0 ? (
                  <>
                     <Information state={state} />
                     <Photo state={state} />
                     <Servings state={state} />
                     <Ingredients state={state} />
                     <Procedures state={state} />
                  </>
               ) : (
                  <RecipeCard state={state} />
               )}
            </StyledWrapper>
         </>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
