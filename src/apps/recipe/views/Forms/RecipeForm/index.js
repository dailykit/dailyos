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
import { RecipeActions, RecipeType, Container } from './styled'

import AddIngredients from './AddIngredients'
import Menu from '../../../components/Menu'
import RecipeMeta from './Tunnels/RecipeMeta'
import MetaView from './MetaView'

import { RECIPE, UPDATE_RECIPE } from '../../../graphql'

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.'

export default function AddRecipeForm() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [recipeState, recipeDispatch] = useReducer(
      recipeReducers,
      initialRecipeState
   )
   const { state, dispatch } = useContext(Context)
   const [chefName, setChefName] = React.useState('')

   const recipeTypeOptions = [
      { id: 1, title: 'Vegetarian' },
      { id: 2, title: 'Non-Vegetarian' },
      { id: 3, title: 'Vegan' },
   ]

   // Queries and Mutations
   useQuery(RECIPE, {
      variables: { ID: state.current.ID },
      onCompleted: ({ recipe }) => {
         if (recipe.chef) setChefName(recipe.chef)
         recipeDispatch({
            type: 'POPULATE_STATE',
            payload: { recipe, recipeTypeOptions },
         })
      },
   })

   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: data => {
         if (data.updateRecipe.success) {
            // set global state after updating
         } else {
            // Fire toast
            console.log(data)
         }
      },
   })

   // Handlers
   const save = () => {
      // Preparing basic object
      const pushable = {
         ...recipeState.pushableState,
         procedures: recipeState.procedures,
         chef: chefName,
      }
      updateRecipe({ variables: { input: pushable } })
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
                     label={t(address.concat("recipe name"))}
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
                     {t(address.concat('save'))}
                  </TextButton>

                  <TextButton
                     onClick={handlePublish}
                     type="solid"
                     style={{ margin: '0px 10px' }}
                  >
                     {t(address.concat('publish'))}
                  </TextButton>
               </RecipeActions>
            </Menu>

            {recipeState.pushableState.description && (
               <MetaView open={openTunnel} />
            )}

            <RecipeType>
               <RadioGroup
                  options={recipeTypeOptions}
                  active={recipeState.recipeType?.id || 2}
                  onChange={type =>
                     recipeDispatch({
                        type: 'CHANGE_RECIPE_TYPE',
                        payload: type,
                     })
                  }
               />
            </RecipeType>

            <Container>
               <div style={{ width: '40%' }}>
                  <Input
                     label={t(address.concat("chef name"))}
                     type="text"
                     name="chef"
                     value={chefName}
                     onChange={e => setChefName(e.target.value)}
                  />
               </div>
               <br />
               {!recipeState.pushableState.description && (
                  <ButtonTile
                     as="button"
                     type="secondary"
                     text={t(address.concat("add description"))}
                     onClick={() => openTunnel(1)}
                  />
               )}
               <br />
               <ButtonTile
                  onClick={() => { }}
                  type="primary"
                  size="lg"
                  text={t(address.concat("add photos to your recipe"))}
                  helper={(t(address.concat("upto 1MB"))).concat("&#8226;").concat(t(address.concat("only JPGs, PNGs, and PDFs are allowed.")))}
               />
               <AddIngredients />
            </Container>
         </ViewWrapper>
      </RecipeContext.Provider>
   )
}
