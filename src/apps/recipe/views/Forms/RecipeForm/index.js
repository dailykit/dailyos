import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Input,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
   Text,
   Toggle,
} from '@dailykit/ui'
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
} from '../styled'

import {
   Information,
   Procedures,
   Servings,
   Ingredients,
   Photo,
} from './components'
import {
   InformationTunnel,
   ProceduresTunnel,
   ServingsTunnel,
   IngredientsTunnel,
   ProcessingsTunnel,
   ConfigureIngredientTunnel,
   SachetTunnel,
   PhotoTunnel,
} from './tunnels'
import {
   UPDATE_RECIPE,
   S_RECIPE,
   S_INGREDIENTS,
   CUISINES,
} from '../../../graphql'

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
   const [cuisines, setCuisines] = React.useState([])

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
   })
   useSubscription(S_INGREDIENTS, {
      onSubscriptionData: data => {
         const ingredients = data.subscriptionData.data.ingredients.filter(
            ing => ing.isValid.status && ing.isPublished
         )
         console.log(ingredients)
         setIngredients(ingredients)
      },
   })
   useSubscription(CUISINES, {
      onSubscriptionData: data => {
         setCuisines(data.subscriptionData.data.cuisineNames)
      },
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
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
         return toast.error('Recipe should be valid!')
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
         <React.Fragment>
            {/* Tunnels */}
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <InformationTunnel
                     state={state}
                     closeTunnel={closeTunnel}
                     cuisines={cuisines}
                  />
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
               <Tunnel layer={7}>
                  <SachetTunnel
                     closeTunnel={closeTunnel}
                     sachets={
                        ingredients[
                           ingredients.findIndex(
                              ing => ing.id === recipeState.edit?.id
                           )
                        ]?.ingredientProcessings[
                           ingredients[
                              ingredients.findIndex(
                                 ing => ing.id === recipeState.edit?.id
                              )
                           ]?.ingredientProcessings.findIndex(
                              proc =>
                                 proc.id ===
                                 recipeState.edit?.ingredientProcessing?.id
                           )
                        ]?.ingredientSachets || []
                     }
                  />
               </Tunnel>
               <Tunnel layer={8}>
                  <PhotoTunnel state={state} closeTunnel={closeTunnel} />
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
               <MasterSettings>
                  <div>
                     {state.isValid?.status ? (
                        <React.Fragment>
                           <TickIcon color="#00ff00" stroke={2} />
                           <Text as="p">All good!</Text>
                        </React.Fragment>
                     ) : (
                        <React.Fragment>
                           <CloseIcon color="#ff0000" />
                           <Text as="p">{state.isValid?.error}</Text>
                        </React.Fragment>
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
               <Information state={state} openTunnel={openTunnel} />
               <Photo state={state} openTunnel={openTunnel} />
               <Servings state={state} openTunnel={openTunnel} />
               <Ingredients state={state} openTunnel={openTunnel} />
               <Procedures state={state} openTunnel={openTunnel} />
            </StyledWrapper>
         </React.Fragment>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
