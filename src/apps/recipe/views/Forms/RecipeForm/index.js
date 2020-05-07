import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Tunnel, Tunnels, useTunnel, Loader } from '@dailykit/ui'

import { Context } from '../../../context/tabs'
import {
   state as initialState,
   reducers,
   RecipeContext,
} from '../../../context/recipee'

import { StyledWrapper, StyledHeader, InputWrapper } from '../styled'

import { Information, Procedures, Servings, Ingredients } from './components'
import {
   InformationTunnel,
   ProceduresTunnel,
   ServingsTunnel,
   IngredientsTunnel,
   ProcessingsTunnel,
   ConfigureIngredientTunnel,
} from './tunnels'
import { UPDATE_RECIPE, S_RECIPE, S_INGREDIENTS } from '../../../graphql'

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
   const [ingredients, setIngredients] = React.useState([])

   // Tunnels
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscription
   const { loading } = useSubscription(S_RECIPE, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.simpleRecipe)
         setTitle(data.subscriptionData.data.simpleRecipe.name)
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(S_INGREDIENTS, {
      onSubscriptionData: data => {
         setIngredients(data.subscriptionData.data.ingredients)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            name: title,
         },
      },
      onCompleted: () => {
         toast.success('Name updated!')
         dispatch({
            type: 'SET_TITLE',
            payload: { oldTitle: tabs.current.title, title },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   // Handlers
   const updateName = () => {
      updateRecipe()
   }

   if (loading) return <Loader />

   return (
      <RecipeContext.Provider value={{ recipeState, recipeDispatch }}>
         <React.Fragment>
            {/* Tunnels */}
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <InformationTunnel state={state} closeTunnel={closeTunnel} />
               </Tunnel>
               <Tunnel layer={2}>
                  <ProceduresTunnel state={state} closeTunnel={closeTunnel} />
               </Tunnel>
               <Tunnel layer={3}>
                  <ServingsTunnel state={state} closeTunnel={closeTunnel} />
               </Tunnel>
               <Tunnel layer={4}>
                  <IngredientsTunnel
                     closeTunnel={closeTunnel}
                     openTunnel={openTunnel}
                     ingredients={ingredients}
                  />
               </Tunnel>
               <Tunnel layer={5}>
                  <ProcessingsTunnel
                     state={state}
                     closeTunnel={closeTunnel}
                     processings={
                        ingredients[
                           ingredients.findIndex(
                              ing => ing.id === recipeState.newIngredient?.id
                           )
                        ]?.ingredientProcessings || []
                     }
                  />
               </Tunnel>
               <Tunnel layer={6}>
                  <ConfigureIngredientTunnel
                     state={state}
                     closeTunnel={closeTunnel}
                  />
               </Tunnel>
            </Tunnels>
            {/* View */}
            <StyledHeader>
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
            </StyledHeader>
            <StyledWrapper width="980">
               <Information state={state} openTunnel={openTunnel} />
               {/* Photo component */}
               <Servings state={state} openTunnel={openTunnel} />
               <Ingredients state={state} openTunnel={openTunnel} />
               <Procedures state={state} openTunnel={openTunnel} />
            </StyledWrapper>
         </React.Fragment>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
