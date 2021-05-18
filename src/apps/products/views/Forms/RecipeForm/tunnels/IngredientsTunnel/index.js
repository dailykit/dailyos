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
   Dropdown,
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

   // State for search input
   const [search, setSearch] = React.useState('')
   const [ingredients, setIngredients] = React.useState([])
   const [list, current, selectOption] = useSingleList(ingredients)
   let [IngredientsSelected] = React.useState([])
   // Mutation
   const [createSimpleRecipeIngredientProcessings] = useMutation(
      CREATE_SIMPLE_RECIPE_INGREDIENT_PROCESSINGS,
      {
         onCompleted: () => {
            toast.success('Ingredient added!')
            closeTunnel(2)
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

   const select = option => {
      console.log(option)
      selectOption('id', option.id)
      recipeDispatch({
         type: 'ADD_INGREDIENT',
         payload: option,
      })
      openTunnel(2)
   }

   
   const add = () => {
      createSimpleRecipeIngredientProcessings({
         variables: {
            objects: IngredientsSelected,
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
   const selectedOption = option => {
      IngredientsSelected = []
      option.map(item => {
         IngredientsSelected.push({
            ingredientId: item.id,
            simpleRecipeId: state.id,
         })
      })
      console.log(IngredientsSelected, 'Adrish Selected')
   }
   const searchedOption = option => console.log(option, 'Adrish Searched')

   return (
      <>
         <TunnelHeader
            title="Select Ingredient"
            close={() => closeTunnel(1)}
            tooltip={<Tooltip identifier="ingredients_tunnel" />}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  <div>
                     <Dropdown
                        type="multi"
                        options={ingredients}
                        searchedOption={searchedOption}
                        selectedOption={selectedOption}
                        placeholder="type what you're looking for..."
                     />
                  </div>
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default IngredientsTunnel
