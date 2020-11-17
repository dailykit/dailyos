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
   InventoryProductForm,
   SimpleRecipeProductForm,
   CustomizableProductForm,
   ComboProductForm,
   ProductsListing,
} from '../../views'
import { ErrorBoundary, Flex } from '../../../../shared/components'
import { useAccess } from '../../../../shared/providers'

const Main = () => {
   const { canAccessRoute, accessPermission } = useAccess()
   return (
      <main>
         <Switch>
            <Route path="/products" exact>
               {canAccessRoute('home') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <Home />
                  </ErrorBoundary>
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
            <Route path="/products/recipes" exact>
               {canAccessRoute('recipes') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <RecipesListing />
                  </ErrorBoundary>
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
            <Route path="/products/recipes/:id" exact>
               {canAccessRoute('recipe') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <RecipeForm />
                  </ErrorBoundary>
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
            <Route path="/products/ingredients" exact>
               {canAccessRoute('ingredients') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <IngredientsListing />
                  </ErrorBoundary>
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
            <Route path="/products/ingredients/:id" exact>
               {canAccessRoute('ingredient') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <IngredientForm />
                  </ErrorBoundary>
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
            <Route path="/products/products" exact>
               {canAccessRoute('products') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <ProductsListing />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'products')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to access products listing.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/products/inventory-products/:id" exact>
               {canAccessRoute('inventory-product') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <InventoryProductForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'inventory-product')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see inventory product details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/products/simple-recipe-products/:id" exact>
               {canAccessRoute('simple-recipe-product') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <SimpleRecipeProductForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'simple-recipe-product')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see simple recipe product details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/products/customizable-products/:id" exact>
               {canAccessRoute('customizable-product') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <CustomizableProductForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'customizable-product')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see customizable product details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
            <Route path="/products/combo-products/:id" exact>
               {canAccessRoute('combo-product') ? (
                  <ErrorBoundary rootRoute="/apps/products">
                     <ComboProductForm />
                  </ErrorBoundary>
               ) : (
                  <Flex
                     container
                     height="100%"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Text as="title">
                        {accessPermission('ROUTE_READ', 'combo-product')
                           ?.fallbackMessage ||
                           'You do not have sufficient permission to see combo product details.'}
                     </Text>
                  </Flex>
               )}
            </Route>
         </Switch>
      </main>
   )
}

export default Main
