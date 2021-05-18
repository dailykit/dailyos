import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   List,
   ListHeader,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
   useMultiList,
   Dropdown,
   TagGroup,
   Tag,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { RecipeContext } from '../../../../../context/recipe'
import {
   CREATE_INGREDIENT,
   S_INGREDIENTS,
   CREATE_SIMPLE_RECIPE_INGREDIENT_PROCESSINGS,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'

const IngredientsTunnel = ({ state, closeTunnel, openTunnel }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)
   let ingredients_selected_temp = []
   // State for search input
   const [search, setSearch] = React.useState('')
   const [ingredients, setIngredients] = React.useState([])
   let [IngredientsSelected, setIngredientsSelected] = React.useState([])
   const [list, selected, selectOption] = useMultiList(ingredients)
   // Mutation
   const [createSimpleRecipeIngredientProcessings] = useMutation(
      CREATE_SIMPLE_RECIPE_INGREDIENT_PROCESSINGS,
      {
         onCompleted: () => {
            toast.success('Ingredient added!')
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   // Query
   const { loading } = useSubscription(S_INGREDIENTS, {
      onSubscriptionData: data => {
         const updatedIngredients = data.subscriptionData.data.ingredients.map(
            ({ id, name }) => ({ id, title: name })
         )
         setIngredients(updatedIngredients)
      },
   })

   const [createIngredient] = useMutation(CREATE_INGREDIENT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const add = () => {
      
      setIngredientsSelected([])
      const tempIngredientSelected=selected.map(item => {
         return {
               ingredientId: item.id,
               simpleRecipeId: state.id,
            }
      })
      createSimpleRecipeIngredientProcessings({
         variables: {
            objects: tempIngredientSelected
         },
      })
   }

   const quickCreateIngredient = () => {
      const ingredientName = search.slice(0, 1).toUpperCase() + search.slice(1)
      createIngredient({
         variables: {
            name: ingredientName,
         },
      })
   }
   const selectedOption = option => {}
   const searchedOption = option => console.log(option, 'Adrish Searched')

   return (
      <>
         {/* {console.log(search, 'Adrish Search')}
         {console.log(ingredients, 'Adrish ingredients')} */}

         <TunnelHeader
            title="Select Ingredient"
            close={() => closeTunnel(1)}
            right={{ action: add, title: 'Add' }}
            tooltip={<Tooltip identifier="ingredients_tunnel" />}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <List>
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
                  />
                  {selected.length > 0 && (
                     <TagGroup style={{ margin: '8px 0' }}>
                        {}
                        {selected.map(option => (
                           <Tag
                              key={option.id}
                              title={option.title}
                              onClick={() => selectOption('id', option.id)}
                           >
                              {option.title}
                           </Tag>
                        ))}
                     </TagGroup>
                  )}
                  <ListHeader type="MSL1" label="Ingredients" />
                  <ListOptions
                     search={search}
                     handleOnCreate={quickCreateIngredient}
                  >
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="MSL1"
                              key={option.id}
                              title={option.title}
                              onClick={() => {
                                 selectOption('id', option.id)
                              }}
                              isActive={selected.find(
                                 item => item.id === option.id
                              )}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default IngredientsTunnel
