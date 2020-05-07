import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { Container, Grid } from '../styled'
import {
   Text,
   ButtonTile,
   Table,
   TableCell,
   TableBody,
   TableRow,
   TableHead,
   IconButton,
} from '@dailykit/ui'
import {
   UserIcon,
   EyeIcon,
   EditIcon,
   DeleteIcon,
} from '../../../../../assets/icons'

import { UPDATE_RECIPE } from '../../../../../graphql'
import { RecipeContext } from '../../../../../context/recipee'

const Ingredients = ({ state, openTunnel }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   //Handlers
   const edit = ingredient => {
      recipeDispatch({
         type: 'EDIT_INGREDIENT',
         payload: ingredient,
      })
      openTunnel(6)
   }
   const remove = ingredient => {
      const ingredients = state.ingredients
      const index = state.ingredients.findIndex(ing => ing.id === ingredient.id)
      ingredients.splice(index, 1)
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               ingredients,
            },
         },
      })
   }

   return (
      <Container top="32" paddingX="32">
         <Text as="subtitle">Ingredients</Text>
         {!state.simpleRecipeYields?.length ? (
            <Text as="p">
               You have to add atleast one serving before adding Ingredients.
            </Text>
         ) : (
            <React.Fragment>
               {state.ingredients?.length ? (
                  <Container bottom="16">
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Processing</TableCell>
                              {state.simpleRecipeYields.map(serving => (
                                 <TableCell>
                                    <UserIcon color="#555B6E" />
                                    {serving.yield.serving}
                                 </TableCell>
                              ))}
                              <TableCell>Visibility</TableCell>
                              <TableCell>Slip Name</TableCell>
                              <TableCell>Actions</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {state.ingredients.map(ingredient => (
                              <TableRow>
                                 <TableCell>{ingredient.name}</TableCell>
                                 <TableCell>
                                    {
                                       ingredient.ingredientProcessing
                                          .processingName
                                    }
                                 </TableCell>
                                 {state.simpleRecipeYields.map(serving => (
                                    <TableCell>
                                       <UserIcon color="#555B6E" />
                                       {serving.yield.serving}
                                    </TableCell>
                                 ))}
                                 <TableCell align="center">
                                    {ingredient.isVisible ? (
                                       <EyeIcon color="#00A7E1" />
                                    ) : (
                                       ''
                                    )}
                                 </TableCell>
                                 <TableCell>{ingredient.slipName}</TableCell>
                                 <TableCell>
                                    <Grid>
                                       <IconButton
                                          onClick={() => edit(ingredient)}
                                       >
                                          <EditIcon color="#00A7E1" />
                                       </IconButton>
                                       <IconButton
                                          onClick={() => remove(ingredient)}
                                       >
                                          <DeleteIcon color="#FF5A52" />
                                       </IconButton>
                                    </Grid>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Container>
               ) : (
                  ''
               )}
               <ButtonTile
                  type="secondary"
                  text="Add Ingredient"
                  onClick={() => openTunnel(4)}
               />
            </React.Fragment>
         )}
      </Container>
   )
}

export default Ingredients
