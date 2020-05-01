import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
   IconButton,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
} from '@dailykit/ui'

import { generateRandomString } from '../../../utils'

// Icons
import { AddIcon } from '../../../assets/icons'

// State
import { Context } from '../../../context/tabs'

// Styled
import {
   StyledWrapper,
   StyledTableHeader,
   StyledTableActions,
   StyledHeader,
   StyledContent,
} from '../styled'

import { RECIPES, CREATE_RECIPE } from '../../../graphql'

import { useTranslation } from 'react-i18next'

const address = 'apps.recipe.views.listings.recipeslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(Context)
   const addTab = (title, view, ID) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, ID },
      })
   }

   // Queries and Mutations
   const { loading, error, data } = useQuery(RECIPES)
   const [createRecipe] = useMutation(CREATE_RECIPE, {
      onCompleted: data => {
         if (data.createRecipe.success) {
            addTab(
               data.createRecipe.recipe.name,
               'recipe',
               data.createRecipe.recipe.id
            )
         } else {
            // Fire toast
            console.log(data)
         }
      },
   })

   const createRecipeHandler = () => {
      let name = 'recipe-' + generateRandomString()
      createRecipe({ variables: { name } })
   }

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('recipes'))}</h1>
            <p> {t(address.concat('pagination'))} </p>
         </StyledHeader>
         <StyledTableHeader>
            <p>{t(address.concat('filters'))}</p>
            <StyledTableActions>
               <IconButton type="solid" onClick={createRecipeHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('recipe name'))}</TableCell>
                     <TableCell>{t(address.concat('recipe author'))}</TableCell>
                     <TableCell>{t(address.concat('servings'))}</TableCell>
                     <TableCell>{t(address.concat('ingredient count'))}</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data?.recipes.map(recipe => (
                     <TableRow
                        key={recipe.id}
                        onClick={() => addTab(recipe.name, 'recipe', recipe.id)}
                     >
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>
                           {/* {recipe.servings.map(serving => (
                              <div key={serving.id}>
                                 {serving.value}
                                 {recipe.servings[recipe.servings.length - 1]
                                    .id !== serving.id && ','}
                              </div>
                           ))} */}
                           {recipe.name}
                        </TableCell>
                        <TableCell>{recipe.name}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </StyledContent>
      </StyledWrapper>
   )
}

export default RecipesListing
