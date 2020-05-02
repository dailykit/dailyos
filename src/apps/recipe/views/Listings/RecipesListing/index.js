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

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.listings.ingredientslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view },
      })
   }

   // Queries and Mutations
   const { loading, error, data } = useQuery(RECIPES)
   // const [createRecipe] = useMutation(CREATE_RECIPE, {
   //    onCompleted: data => {
   //       if (data.createRecipe.success) {
   //          addTab(
   //             data.createRecipe.recipe.name,
   //             'recipe',
   //             data.createRecipe.recipe.id
   //          )
   //       } else {
   //          // Fire toast
   //          console.log(data)
   //       }
   //    },
   // })

   // const createRecipeHandler = () => {
   //    let name = 'recipe-' + generateRandomString()
   //    createRecipe({ variables: { name } })
   // }

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('recipes'))}</h1>
            <p> {t(address.concat('total'))}: {data?.simpleRecipes.length} </p>
         </StyledHeader>
         <StyledTableHeader>
            <p></p>
            <StyledTableActions>
               <IconButton
                  type="solid"
                  onClick={() => addTab('Unititled Recipe', 'recipe')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('name'))}</TableCell>
                     <TableCell>{t(address.concat('author'))}</TableCell>
                     <TableCell>{t(address.concat('# of servings'))}</TableCell>
                     <TableCell>{t(address.concat('cooking time'))}</TableCell>
                     <TableCell></TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data?.simpleRecipes.map(recipe => (
                     <TableRow key={recipe.id}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>
                           {recipe.simpleRecipeYields.length}
                        </TableCell>
                        <TableCell>{recipe.cookingTime} {t('units.mins')}.</TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </StyledContent>
      </StyledWrapper>
   )
}

export default RecipesListing
