import { Flex, Spacer, Text } from '@dailykit/ui'
import React, { useEffect, useState } from 'react'

import { NewTab } from '../../../../../../../shared/assets/icons'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'

export const RecipeSource = ({ rawIngredientId }) => {
   const [recipes, setRecipes] = useState([])
   const { getRecipeByRawIngredient } = useAnykitMatches({})

   useEffect(() => {
      getRecipeByRawIngredient(rawIngredientId).then(resc => setRecipes(resc))
   }, [rawIngredientId])

   return (
      <>
         {recipes.map(data => (
            <Flex
               key={data.recipe.id}
               as="button"
               container
               alignItems="center"
               style={{ cursor: 'pointer', background: 'none', border: '0' }}
               onClick={() => {
                  window.open(data.recipe.url, '_blank')
               }}
            >
               <Text style={{ color: '#00A7E1' }} as="h2">
                  {data.recipe.name}
               </Text>
               <Spacer xAxis size="4px" />
               <NewTab />
            </Flex>
         ))}
      </>
   )
}
