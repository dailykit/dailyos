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
   PlusIcon,
} from '@dailykit/ui'
import {
   UserIcon,
   EyeIcon,
   EditIcon,
   DeleteIcon,
} from '../../../../../assets/icons'

import {
   UPDATE_RECIPE,
   DELETE_SIMPLE_RECIPE_YIELD_SACHETS,
} from '../../../../../graphql'
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
   const [deleteYieldSachets] = useMutation(
      DELETE_SIMPLE_RECIPE_YIELD_SACHETS,
      {
         onCompleted: () => {
            console.log('Deleted Sachets!')
         },
         onError: error => {
            console.log(error)
         },
      }
   )

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
      deleteSachets(ingredient.id)
   }

   const deleteSachets = ingId => {
      const servingIds = state.simpleRecipeYields.map(serving => serving.id)
      const sachetIds = state.simpleRecipeYields
         .flatMap(serving => {
            return serving.ingredientSachets.map(sachet => {
               if (sachet.ingredientSachet.ingredient.id === ingId)
                  return sachet.ingredientSachet.id
            })
         })
         .filter(id => id)
      deleteYieldSachets({
         variables: {
            servingIds,
            sachetIds,
         },
      })
   }

   const addSachet = (ingredient, serving, updating = false) => {
      recipeDispatch({
         type: 'EDIT_INGREDIENT',
         payload: ingredient,
      })
      recipeDispatch({
         type: 'SERVING',
         payload: serving,
      })
      recipeDispatch({
         type: 'UPDATING',
         payload: updating ? true : false,
      })
      openTunnel(7)
   }

   const editSachet = (ingredient, serving) => {
      const sachet = serving.ingredientSachets.find(
         sachet => sachet.ingredientSachet.ingredient?.id === ingredient.id
      ).ingredientSachet
      recipeDispatch({
         type: 'SACHET',
         payload: sachet,
      })
      addSachet.call(this, ingredient, serving, true)
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
                                 <TableCell key={serving.id}>
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
                              <TableRow key={ingredient.id}>
                                 <TableCell>{ingredient.name}</TableCell>
                                 <TableCell>
                                    {
                                       ingredient.ingredientProcessing
                                          .processingName
                                    }
                                 </TableCell>
                                 {state.simpleRecipeYields.map(serving => (
                                    <TableCell key={serving.id}>
                                       {serving.ingredientSachets?.find(
                                          sachet =>
                                             sachet.ingredientSachet.ingredient
                                                ?.id === ingredient.id
                                       ) ? (
                                          <React.Fragment>
                                             <span>
                                                {serving.ingredientSachets
                                                   ?.find(
                                                      sachet =>
                                                         sachet.ingredientSachet
                                                            .ingredient?.id ===
                                                         ingredient.id
                                                   )
                                                   ?.ingredientSachet.quantity.toString()}{' '}
                                                {
                                                   serving.ingredientSachets?.find(
                                                      sachet =>
                                                         sachet.ingredientSachet
                                                            .ingredient?.id ===
                                                         ingredient.id
                                                   )?.ingredientSachet.unit
                                                }
                                             </span>
                                             <span
                                                onClick={() =>
                                                   editSachet(
                                                      ingredient,
                                                      serving
                                                   )
                                                }
                                             >
                                                <EditIcon color="#00A7E1" />
                                             </span>
                                          </React.Fragment>
                                       ) : (
                                          <span
                                             onClick={() =>
                                                addSachet(ingredient, serving)
                                             }
                                          >
                                             <PlusIcon color="#00A7E1" />
                                          </span>
                                       )}
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
