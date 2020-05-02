import React, { useContext, useReducer } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
   Input,
   TextButton,
   RadioGroup,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui/'

import { Context } from '../../../context/tabs/index'
import {
   Context as RecipeContext,
   state as initialRecipeState,
   reducers as recipeReducers,
} from '../../../context/recipe/index'

import { ViewWrapper } from '../../../components/Styled/ViewWrapper'
import { RecipeActions, RecipeType, Container, InputGrid } from './styled'

import AddIngredients from './AddIngredients'
import Menu from '../../../components/Menu'
import RecipeMeta from './Tunnels/RecipeMeta'
import MetaView from './MetaView'

import { CREATE_SIMPLE_RECIPE } from '../../../graphql'
import { toast } from 'react-toastify'

export default function AddRecipeForm() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [recipeState, recipeDispatch] = useReducer(
      recipeReducers,
      initialRecipeState
   )
   const { state, dispatch } = useContext(Context)
   const [chefName, setChefName] = React.useState('')
   const [cuisine, setCuisine] = React.useState('')

   const recipeTypeOptions = [
      { id: 1, title: 'Vegetarian' },
      { id: 2, title: 'Non-Vegetarian' },
      { id: 3, title: 'Vegan' },
   ]

   // Mutation
   const [createRecipe] = useMutation(CREATE_SIMPLE_RECIPE, {
      onCompleted: data => {
         console.log(data)
         toast.success(`${data.createSimpleRecipe.returning[0].name} added!`)
      },
      onError: error => {
         console.log(error)
         toast.error('Unkown error!')
      },
   })

   // Handlers
   const save = () => {
      // Prepare ingredients
      const ingredients = recipeState.ingredients.map(ing => {
         return {
            id: ing.id,
            isVisible: ing.isVisible,
            name: ing.name,
            slipName: ing.slipName || ing.name,
            processing: {
               id: ing.processing.id,
               name: ing.processing.processingName,
            },
         }
      })
      // Prepare servings
      const servings = recipeState.servings.map(serving => {
         return {
            yield: {
               serving: serving.value,
            },
            ingredientSachets: {
               data: [],
            },
         }
      })
      // Populate sachets
      recipeState.sachets.forEach(sachet => {
         const index = servings.findIndex(
            serving => serving.yield.serving == sachet.serving.value
         )
         servings[index].ingredientSachets.data.push({
            ingredientSachetId: sachet.id,
         })
      })
      // Preparing basic object
      const object = {
         cuisine,
         author: chefName,
         cookingTime: recipeState.pushableState.cookingTime,
         description: recipeState.pushableState.description,
         utensilsRequired: recipeState.pushableState.utensils,
         type: recipeState.pushableState.type,
         name: recipeState.name,
         procedures: recipeState.procedures,
         ingredients,
         simpleRecipeYields: {
            data: servings,
         },
      }
      console.log(object)
      // Save
      createRecipe({
         variables: {
            objects: [object],
         },
      })
   }

   const handlePublish = () => {
      const pushable = {
         ...recipeState.pushableState,
         procedures: recipeState.procedures,
         chef: chefName,
      }

      console.log('%c values', 'color: #28c1f7', {
         state: pushable,
      })
   }

   const handleRecipeNameChange = e => {
      const name = e.target.value
      recipeDispatch({ type: 'RECIPE_NAME_CHANGE', payload: { name } })
   }

   const handleTabNameChange = () => {
      // TODO: add utils/generateRandomString() later to the title
      const title = `${recipeState.name}`

      if (title.length > 0) {
         dispatch({
            type: 'SET_TITLE',
            payload: { title, oldTitle: state.current.title },
         })
      } else {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               title: 'Untitled Recipe',
               oldTitle: state.current.title,
            },
         })
      }
   }

   return (
      <RecipeContext.Provider value={{ recipeState, recipeDispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <RecipeMeta close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <ViewWrapper>
            <Menu>
               <div>
                  <Input
                     label="Recipe Name"
                     type="text"
                     name="recipeName"
                     value={recipeState.name}
                     onChange={handleRecipeNameChange}
                     onBlur={handleTabNameChange}
                  />
               </div>

               <RecipeActions>
                  <TextButton
                     type="ghost"
                     style={{ margin: '0px 10px' }}
                     onClick={save}
                  >
                     Save
                  </TextButton>

                  <TextButton
                     onClick={handlePublish}
                     type="solid"
                     style={{ margin: '0px 10px' }}
                  >
                     Publish
                  </TextButton>
               </RecipeActions>
            </Menu>

            {recipeState.pushableState.description && (
               <MetaView open={openTunnel} />
            )}

            <RecipeType>
               <RadioGroup
                  options={recipeTypeOptions}
                  active={2}
                  onChange={type =>
                     recipeDispatch({
                        type: 'CHANGE_RECIPE_TYPE',
                        payload: type,
                     })
                  }
               />
            </RecipeType>

            <Container>
               <InputGrid>
                  <Input
                     label="Author"
                     type="text"
                     name="chef"
                     value={chefName}
                     onChange={e => setChefName(e.target.value)}
                  />
                  <Input
                     label="Cuisine"
                     type="text"
                     name="cuisine"
                     value={cuisine}
                     onChange={e => setCuisine(e.target.value)}
                  />
               </InputGrid>
               <br />
               {!recipeState.pushableState.description && (
                  <ButtonTile
                     as="button"
                     type="secondary"
                     text="Add Description"
                     onClick={() => openTunnel(1)}
                  />
               )}
               <br />
               <ButtonTile
                  onClick={() => {}}
                  type="primary"
                  size="lg"
                  text="Add photos to your recipe"
                  helper="upto 1MB &#8226; only JPGs, PNGs, and PDFs are allowed."
               />
               <AddIngredients />
            </Container>
         </ViewWrapper>
      </RecipeContext.Provider>
   )
}
