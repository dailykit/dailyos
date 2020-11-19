import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   IconButton,
   PlusIcon,
   Spacer,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import {
   DeleteIcon,
   EditIcon,
   InfoIcon,
   UserIcon,
} from '../../../../../assets/icons'
import { RecipeContext } from '../../../../../context/recipe'
import {
   DELETE_SIMPLE_RECIPE_YIELD_SACHETS,
   UPDATE_RECIPE,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
} from '../../../../../graphql'
import {
   IngredientsTunnel,
   ProcessingsTunnel,
   SachetTunnel,
   YieldInfoTunnel,
} from '../../tunnels'
import validator from '../../validators'

const Ingredients = ({ state }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [
      yieldInfoTunnels,
      openYieldInfoTunnel,
      closeYieldInfoTunnel,
   ] = useTunnel(1)

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
   const [deleteYieldSachets] = useMutation(
      DELETE_SIMPLE_RECIPE_YIELD_SACHETS,
      {
         onCompleted: () => {
            console.log('Deleted Sachets!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const deleteSachets = ing => {
      const servingIds = state.simpleRecipeYields.map(serving => serving.id)
      const sachetIds = state.simpleRecipeYields
         .flatMap(serving => {
            return serving.ingredientSachets.map(sachet => {
               if (
                  sachet.ingredientSachet.ingredient.id === ing.id &&
                  sachet.ingredientSachet.ingredientProcessing.id ===
                     ing.ingredientProcessing.id
               ) {
                  return sachet.ingredientSachet.id
               }
               return undefined
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

   const remove = ingredient => {
      const { ingredients } = state
      const index = state.ingredients.findIndex(
         ing =>
            ing.id === ingredient.id &&
            ing.ingredientProcessing.id === ingredient.ingredientProcessing.id
      )
      ingredients.splice(index, 1)
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               ingredients,
            },
         },
      })
      deleteSachets(ingredient)
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
         payload: updating,
      })
      openTunnel(3)
   }

   const editSachet = (ingredient, serving) => {
      const sachet = serving.ingredientSachets.find(
         item => item.ingredientSachet.ingredient?.id === ingredient.id
      ).ingredientSachet
      recipeDispatch({
         type: 'SACHET',
         payload: sachet,
      })
      addSachet.call(this, ingredient, serving, true)
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <IngredientsTunnel
                  closeTunnel={closeTunnel}
                  openTunnel={openTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <ProcessingsTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <SachetTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={yieldInfoTunnels}>
            <Tunnel layer={1}>
               <YieldInfoTunnel close={closeYieldInfoTunnel} />
            </Tunnel>
         </Tunnels>
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center" justifyContent="flex-start">
               <Text as="subtitle">Ingredients</Text>
               <Tooltip identifier="recipe_ingredients" />
            </Flex>
            <Flex container alignItems="center">
               <Form.Checkbox
                  name="showIngredients"
                  value={state.showIngredients}
                  onChange={() =>
                     updateRecipe({
                        variables: {
                           id: state.id,
                           set: {
                              showIngredients: !state.showIngredients,
                           },
                        },
                     })
                  }
               >
                  <Flex container alignItems="center">
                     Show Ingredients
                     <Tooltip identifier="recipe_show_ingredients" />
                  </Flex>
               </Form.Checkbox>
               <Spacer xAxis size="8px" />
               <Form.Checkbox
                  name="showIngredientsQuantity"
                  value={state.showIngredientsQuantity}
                  onChange={() =>
                     updateRecipe({
                        variables: {
                           id: state.id,
                           set: {
                              showIngredientsQuantity: !state.showIngredientsQuantity,
                           },
                        },
                     })
                  }
               >
                  <Flex container alignItems="center">
                     Show Ingredient's Quantity
                     <Tooltip identifier="recipe_show_ingredients_quantity" />
                  </Flex>
               </Form.Checkbox>
            </Flex>
         </Flex>
         <Spacer size="8px" />
         {!state.simpleRecipeYields?.length ? (
            <Text as="p">
               You have to add at least one serving before adding Ingredients.
            </Text>
         ) : (
            <>
               {Boolean(state.ingredients?.length) && (
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Processing</TableCell>
                           {state.simpleRecipeYields.map(serving => (
                              <TableCell key={serving.id}>
                                 <Flex
                                    container
                                    alignItems="center"
                                    minWidth="140px"
                                 >
                                    <UserIcon color="#555B6E" />
                                    <Spacer xAxis size="4px" />
                                    {serving.yield.serving}
                                    {serving.yield.label &&
                                       `(${serving.yield.label})`}
                                    <Spacer xAxis size="16px" />
                                    <span
                                       tabIndex="0"
                                       role="button"
                                       onKeyPress={e => {
                                          if (e.charCode === 13) {
                                             recipeDispatch({
                                                type: 'SERVING',
                                                payload: serving,
                                             })
                                          }
                                          openYieldInfoTunnel(1)
                                       }}
                                       onClick={() => {
                                          recipeDispatch({
                                             type: 'SERVING',
                                             payload: serving,
                                          })
                                          openYieldInfoTunnel(1)
                                       }}
                                    >
                                       <InfoIcon color="#555B6E" />
                                    </span>
                                 </Flex>
                              </TableCell>
                           ))}
                           <TableCell align="right">Actions</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody noHoverEffect>
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
                                             ?.id === ingredient.id &&
                                          sachet.ingredientSachet
                                             .ingredientProcessing.id ===
                                             ingredient.ingredientProcessing.id
                                    ) ? (
                                       <Sachet
                                          ingredient={ingredient}
                                          serving={serving}
                                          editSachet={editSachet}
                                       />
                                    ) : (
                                       <IconButton
                                          type="ghost"
                                          onClick={() =>
                                             addSachet(ingredient, serving)
                                          }
                                       >
                                          <PlusIcon color="#00A7E1" />
                                       </IconButton>
                                    )}
                                 </TableCell>
                              ))}
                              <TableCell align="right">
                                 <Flex container justifyContent="flex-end">
                                    <IconButton
                                       type="ghost"
                                       onClick={() => remove(ingredient)}
                                    >
                                       <DeleteIcon color="#FF5A52" />
                                    </IconButton>
                                 </Flex>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}
               <Spacer size="16px" />
               <ButtonTile
                  type="secondary"
                  text="Add Ingredient"
                  onClick={() => openTunnel(1)}
               />
            </>
         )}
      </>
   )
}

export default Ingredients

const Sachet = ({ ingredient, serving, editSachet }) => {
   // States
   const [sachet, setSachet] = React.useState(
      serving.ingredientSachets?.find(
         item =>
            item.ingredientSachet.ingredient?.id === ingredient.id &&
            item.ingredientSachet.ingredientProcessing.id ===
               ingredient.ingredientProcessing.id
      )
   )
   const [slipName, setSlipName] = React.useState({
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })

   // Effects
   React.useEffect(() => {
      setSachet(
         serving.ingredientSachets?.find(
            item =>
               item.ingredientSachet.ingredient?.id === ingredient.id &&
               item.ingredientSachet.ingredientProcessing.id ===
                  ingredient.ingredientProcessing.id
         )
      )
   }, [serving])

   React.useEffect(() => {
      setSlipName({ ...slipName, value: sachet.slipName })
   }, [sachet])

   // Mutation
   const [updateSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
      onCompleted: () => {
         toast.success('Sachet updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handler
   const updateVisibility = val => {
      updateSachet({
         variables: {
            sachetId: sachet.ingredientSachet.id,
            yieldId: serving.id,
            set: {
               isVisible: val,
            },
         },
      })
   }
   const updateSlipName = () => {
      const { isValid, errors } = validator.slipName(slipName.value)
      if (isValid) {
         updateSachet({
            variables: {
               sachetId: sachet.ingredientSachet.id,
               yieldId: serving.id,
               set: {
                  slipName: slipName.value,
               },
            },
         })
      }
      setSlipName({
         ...slipName,
         meta: {
            isTouched: true,
            isValid,
            errors,
         },
      })
   }

   return (
      <Flex>
         <Flex container alignItems="center">
            {sachet?.ingredientSachet.quantity.toString()}{' '}
            {sachet?.ingredientSachet.unit}
            <IconButton
               type="ghost"
               onClick={() => editSachet(ingredient, serving)}
            >
               <EditIcon color="#00A7E1" />
            </IconButton>
         </Flex>
         <Form.Group>
            <Form.Toggle
               id={`isVisible=${sachet.ingredientSachet.id}`}
               name={`isVisible=${sachet.ingredientSachet.id}`}
               onChange={() => updateVisibility(!sachet.isVisible)}
               value={sachet.isVisible}
            >
               <Flex container alignItems="center">
                  Visibility
                  <Tooltip identifier="recipe_ingredient_sachet_visibility" />
               </Flex>
            </Form.Toggle>
         </Form.Group>
         <Spacer size="8px" />
         <Form.Group>
            <Form.Label htmlFor="slipName" title="slipName">
               <Flex container alignItems="center">
                  Slip Name*
                  <Tooltip identifier="recipe_ingredient_sachet_slip_name" />
               </Flex>
            </Form.Label>
            <Form.Text
               id={`slipName-${sachet.ingredientSachet.id}`}
               name={`slipName-${sachet.ingredientSachet.id}`}
               onBlur={updateSlipName}
               onChange={e =>
                  setSlipName({ ...slipName, value: e.target.value })
               }
               value={slipName.value}
               placeholder="Enter slip name"
               hasError={slipName.meta.isTouched && !slipName.meta.isValid}
            />
            {slipName.meta.isTouched &&
               !slipName.meta.isValid &&
               slipName.meta.errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
         </Form.Group>
         <Spacer size="8px" />
      </Flex>
   )
}
