import React from 'react'

import styled from 'styled-components'

// State
import { Context } from '../../store/tabs'

// Views
import {
   Home,
   RecipesListing,
   RecipeForm,
   IngredientsListing,
   IngredientForm
} from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'recipes') return <RecipesListing />
   if (type === 'listings' && view === 'ingredients')
      return <IngredientsListing />
   // Forms
   if (type === 'forms' && view === 'recipe') return <RecipeForm />
   if (type === 'forms' && view === 'ingredient') return <IngredientForm />
}

const MainWrapper = styled.main`
   overflow-x: auto;
`

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return (
      <MainWrapper>
         {renderComponent(state.current.type, state.current.view)}
      </MainWrapper>
   )
}

export default Main
