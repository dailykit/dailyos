import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home } from '../../views'
import RecipeInsight from '../../views/RecipeInsight'

const Main = () => {
   return (
      <main style={{ position: 'relative' }}>
         <Switch>
            <Route path="/insights" component={Home} exact />
            <Route path="/insights/recipe" component={RecipeInsight} exact />
         </Switch>
      </main>
   )
}

export default Main
