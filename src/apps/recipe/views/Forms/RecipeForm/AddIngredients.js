import React, { useContext } from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

import {
   Tunnels,
   Tunnel,
   useTunnel,
   ButtonTile,
   Text,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
   Toggle,
} from '@dailykit/ui'

import { Context as RecipeContext } from '../../../context/recipe/index'

import {
   IngredientsSection,
   Stats,
   IngredientTable,
   SelectButton,
} from './styled'

import AddServings from './Tunnels/AddServings'
import SelectIngredients from './Tunnels/SelectIngredients'
import AddSachets from './Tunnels/AddSachets'
import SelectProcessing from './Tunnels/SelectProcessing'
import SelectSachet from './Tunnels/SelectSachet'
import Servings from './Servings'
import AddIcon from '../../../assets/icons/Add'
import EditIcon from '../../../assets/icons/Edit'
import UserIcon from '../../../assets/icons/User'
import DeleteIcon from '../../../assets/icons/Delete'
import CookingSteps from './CookingSteps'

import {
   INGREDIENTS,
   PROCESSINGS_OF_INGREDIENT,
   SACHETS_OF_PROCESSING,
} from '../../../graphql'
import { toast } from 'react-toastify'

export default function AddIngredients() {
   const { recipeState, recipeDispatch } = useContext(RecipeContext)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(5)
   const [ingredients, setIngredients] = React.useState([])
   const [processings, setProcessings] = React.useState([])
   const [sachets, setSachets] = React.useState([])
   const [selected, setSelected] = React.useState({
      ingredientId: undefined,
      processingId: undefined,
   })

   //Query
   useQuery(INGREDIENTS, {
      onCompleted: async data => {
         let ings = data.ingredients
         let updatedIngs = await ings.map(ing => {
            return {
               ...ing,
               title: ing.name,
            }
         })
         setIngredients(updatedIngs)
      },
   })
   const [fetchProcessings, {}] = useLazyQuery(PROCESSINGS_OF_INGREDIENT, {
      fetchPolicy: 'no-cache',
      onCompleted: async data => {
         let procs = data.ingredient.ingredientProcessings
         let updatedProcs = await procs.map(proc => {
            return {
               ...proc,
               title: proc.processingName,
            }
         })
         setProcessings(updatedProcs)
         openTunnel(4)
      },
   })
   const [fetchSachets, {}] = useLazyQuery(SACHETS_OF_PROCESSING, {
      fetchPolicy: 'no-cache',
      onCompleted: async data => {
         let sachets = data.ingredientSachets
         let updatedSachets = sachets.map(sachet => {
            return {
               ...sachet,
               title: sachet.quantity + ' ' + sachet.unit,
            }
         })
         console.log('updatedSachets', updatedSachets)
         setSachets(updatedSachets)
         closeTunnel(4)
         openTunnel(5)
      },
   })

   // Click Handlers
   const select = type => {
      switch (type) {
         case 'processing': {
            if (selected.ingredientId) {
               return fetchProcessings({
                  variables: {
                     ingredientId: selected.ingredientId,
                  },
               })
            } else {
               return toast.error('Select an Ingredient!')
            }
         }
         case 'sachet': {
            if (selected.ingredientId && selected.processingId) {
               return fetchSachets({
                  variables: {
                     ingredientId: selected.ingredientId,
                     processingId: selected.processingId,
                  },
               })
            } else {
               return toast.error('Select a Processing first!')
            }
         }
         default:
            return
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <AddServings close={closeTunnel} next={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <SelectIngredients
                  close={closeTunnel}
                  next={closeTunnel}
                  ings={ingredients}
               />
            </Tunnel>
            <Tunnel layer={3} size="lg">
               <AddSachets close={closeTunnel} openTunnel={openTunnel} />
            </Tunnel>
            {/* tunnel 4 -> select processing */}
            <Tunnel layer={4}>
               <SelectProcessing next={closeTunnel} procs={processings} />
            </Tunnel>

            {/* tunnel 5 -> select Sachet */}
            <Tunnel layer={5}>
               <SelectSachet
                  next={closeTunnel}
                  serving={recipeState.activeServing}
                  sachets={sachets}
               />
            </Tunnel>
         </Tunnels>
         <Servings open={openTunnel} />
         <IngredientsSection>
            <Stats>
               <Text as="subtitle">
                  Ingredients (
                  {(recipeState &&
                     recipeState.ingredients &&
                     recipeState.ingredients.length) ||
                     '0'}
                  )
               </Text>
               {recipeState.ingredients.length > 0 && (
                  <IconButton type="ghost" onClick={() => openTunnel(2)}>
                     <AddIcon />
                  </IconButton>
               )}
            </Stats>

            {recipeState.ingredients.length > 0 ? (
               <IngredientTable>
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell></TableCell>
                           <TableCell>Ingredient Name</TableCell>
                           <TableCell align="center">Visibility</TableCell>
                           <TableCell align="center">Processing</TableCell>
                           {recipeState.servings.map(serving => (
                              <TableCell key={serving.id}>
                                 <UserIcon />
                                 <span style={{ marginLeft: '5px' }}>
                                    {serving.value}
                                 </span>
                              </TableCell>
                           ))}
                           <TableCell align="right"></TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {recipeState.ingredients.map(ingredient => (
                           <TableRow
                              key={ingredient.id}
                              onClick={() =>
                                 setSelected({
                                    ingredientId: ingredient.id,
                                    processingId: ingredient?.processing?.id,
                                 })
                              }
                           >
                              <TableCell></TableCell>
                              <TableCell>{ingredient.title}</TableCell>
                              <TableCell>
                                 <Toggle
                                    checked={ingredient.isVisible}
                                    setChecked={() =>
                                       recipeDispatch({
                                          type: 'VISIBILITY',
                                          payload: {
                                             id: ingredient.id,
                                          },
                                       })
                                    }
                                 />
                              </TableCell>
                              <TableCell>
                                 {ingredient?.processing?.title || (
                                    <IconButton
                                       type="outline"
                                       onClick={() => {
                                          recipeDispatch({
                                             type: 'SET_VIEW',
                                             payload: ingredient,
                                          })
                                          select('processing')
                                          // openTunnel(4)
                                       }}
                                    >
                                       <AddIcon color="#00a7e1" />
                                    </IconButton>
                                 )}
                              </TableCell>
                              {recipeState.servings.map(serving => (
                                 <TableCell key={serving.id}>
                                    <Sachet
                                       ingredient={ingredient}
                                       serving={serving}
                                       openTunnel={openTunnel}
                                       select={select}
                                    />
                                 </TableCell>
                              ))}
                              <TableCell align="right">
                                 <span
                                    style={{
                                       display: 'flex',
                                    }}
                                 >
                                    <IconButton
                                       type="solid"
                                       onClick={() => {
                                          openTunnel(3)
                                       }}
                                    >
                                       <EditIcon />
                                    </IconButton>
                                    <IconButton
                                       onClick={() => {
                                          recipeDispatch({
                                             type: 'DELETE_INGREDIENT',
                                             payload: ingredient,
                                          })
                                       }}
                                    >
                                       <DeleteIcon color="rgb(255,90,82)" />
                                    </IconButton>
                                 </span>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </IngredientTable>
            ) : null}

            {recipeState.ingredients.length === 0 && (
               <ButtonTile
                  as="button"
                  type="secondary"
                  text="Select Ingredients"
                  onClick={() => openTunnel(2)}
               />
            )}
         </IngredientsSection>
         <CookingSteps />
      </>
   )
}

function Sachet({ serving, openTunnel, ingredient, select }) {
   const { recipeState, recipeDispatch } = useContext(RecipeContext)

   const sachet = recipeState.sachets.find(
      sachet =>
         sachet.serving.id === serving.id &&
         sachet.ingredient.id === ingredient.id
   )

   return (
      <>
         {sachet?.title || (
            <SelectButton
               onClick={() => {
                  recipeDispatch({
                     type: 'SET_ACTIVE_SERVING',
                     payload: serving,
                  })
                  recipeDispatch({
                     type: 'SET_VIEW',
                     payload: ingredient,
                  })
                  select('sachet')
                  // openTunnel(5)
               }}
            >
               Select Sachet
            </SelectButton>
         )}
      </>
   )
}
