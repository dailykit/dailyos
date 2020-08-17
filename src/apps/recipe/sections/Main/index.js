import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   RecipesListing,
   RecipeForm,
   IngredientsListing,
   IngredientForm,
} from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/recipe" exact>
               <Home />
            </Route>
            <Route path="/recipe/recipes" exact>
               <RecipesListing />
            </Route>
            <Route path="/recipe/recipes/:id" exact>
               <RecipeForm />
            </Route>
            <Route path="/recipe/ingredients" exact>
               <IngredientsListing />
            </Route>
            <Route path="/recipe/ingredients/:id" exact>
               <IngredientForm />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
