import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   PlusIcon,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Text,
   Toggle,
   Input,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   DeleteIcon,
   EditIcon,
   UserIcon,
   InfoIcon,
} from '../../../../../assets/icons'
import { RecipeContext } from '../../../../../context/recipee'
import {
   DELETE_SIMPLE_RECIPE_YIELD_SACHETS,
   UPDATE_RECIPE,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
} from '../../../../../graphql'
import { Container, Grid, Flex } from '../styled'
import {
   IngredientsTunnel,
   ProcessingsTunnel,
   SachetTunnel,
   YieldInfoTunnel,
} from '../../tunnels'

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
         <Container top="32" paddingX="32">
            <Text as="subtitle">Ingredients</Text>
            {!state.simpleRecipeYields?.length ? (
               <Text as="p">
                  You have to add atleast one serving before adding Ingredients.
               </Text>
            ) : (
               <>
                  {state.ingredients?.length ? (
                     <Container bottom="16">
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell>Name</TableCell>
                                 <TableCell>Processing</TableCell>
                                 {state.simpleRecipeYields.map(serving => (
                                    <TableCell key={serving.id}>
                                       <UserIcon color="#555B6E" />{' '}
                                       {serving.yield.serving}{' '}
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
                                    </TableCell>
                                 ))}
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
                                                sachet.ingredientSachet
                                                   .ingredient?.id ===
                                                   ingredient.id &&
                                                sachet.ingredientSachet
                                                   .ingredientProcessing.id ===
                                                   ingredient
                                                      .ingredientProcessing.id
                                          ) ? (
                                             <Sachet
                                                ingredient={ingredient}
                                                serving={serving}
                                                editSachet={editSachet}
                                             />
                                          ) : (
                                             <span
                                                tabIndex="0"
                                                role="button"
                                                onKeyDown={e =>
                                                   e.charCode === 13 &&
                                                   addSachet(
                                                      ingredient,
                                                      serving
                                                   )
                                                }
                                                onClick={() =>
                                                   addSachet(
                                                      ingredient,
                                                      serving
                                                   )
                                                }
                                             >
                                                <PlusIcon color="#00A7E1" />
                                             </span>
                                          )}
                                       </TableCell>
                                    ))}
                                    <TableCell>
                                       <Grid>
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
                     onClick={() => openTunnel(1)}
                  />
               </>
            )}
         </Container>
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
   const [slipName, setSlipName] = React.useState(sachet.slipName || '')

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
      setSlipName(sachet.slipName)
   }, [sachet])

   // Mutation
   const [updateSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
      onCompleted: () => {
         toast.success('Sachet updated!')
      },
      onError: error => {
         console.log(error)
         toast.error()
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
      if (slipName) {
         updateSachet({
            variables: {
               sachetId: sachet.ingredientSachet.id,
               yieldId: serving.id,
               set: {
                  slipName,
               },
            },
         })
      }
   }

   return (
      <Flex direction="column">
         <Container top="8">
            <Flex>
               <span>
                  {sachet?.ingredientSachet.quantity.toString()}{' '}
                  {sachet?.ingredientSachet.unit}
               </span>
               <span
                  tabIndex="0"
                  role="button"
                  onKeyDown={e =>
                     e.charCode === 13 && editSachet(ingredient, serving)
                  }
                  onClick={() => editSachet(ingredient, serving)}
               >
                  <EditIcon color="#00A7E1" />
               </span>
            </Flex>
         </Container>
         <Container top="10">
            <Toggle
               checked={sachet.isVisible}
               label="Visibility"
               setChecked={updateVisibility}
            />
         </Container>
         <Container top="12">
            <Input
               type="text"
               label="Slip Name"
               name="slip-name"
               value={slipName}
               onChange={e => setSlipName(e.target.value)}
               onBlur={updateSlipName}
            />
         </Container>
      </Flex>
   )
}
