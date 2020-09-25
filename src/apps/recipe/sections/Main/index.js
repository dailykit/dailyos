import React from 'react'
import { Text } from '@dailykit/ui'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   RecipesListing,
   RecipeForm,
   IngredientsListing,
   IngredientForm,
} from '../../views'
import { Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/recipe" exact>
               {canAccessRoute('home') ? (
                  <Home />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'home')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access recipe app.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/recipe/recipes" exact>
               {canAccessRoute('recipes') ? (
                  <RecipesListing />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'recipes')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see recipes listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/recipe/recipes/:id" exact>
               {canAccessRoute('recipe') ? (
                  <RecipeForm />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'recipe')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see recipe details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/recipe/ingredients" exact>
               {canAccessRoute('ingredients') ? (
                  <IngredientsListing />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'ingredients')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see ingredients listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/recipe/ingredients/:id" exact>
               {canAccessRoute('ingredient') ? (
                  <IngredientForm />
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'ingredient')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see ingredient details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}

export default Main
