import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import { BrandName } from './styled'
import BrandContext from '../../context/Brand'
import { ViewIcon } from '../../../../shared/assets/icons'
// Views
import { PageListing, Home, PageForm } from '../../views'

export default function Main() {
   const [context, setContext] = useContext(BrandContext)
   return (
      <main>
         <Switch>
            <Route path="/content" component={Home} exact />

            <Route path="/content/pages" component={PageListing} exact />

            <Route
               path="/content/pages/:pageId/:pageName"
               component={PageForm}
               exact
            />

            <Route exact path="/content/settings">
               <h1>Setting Page</h1>
            </Route>
            <Route exact path="/content/blocks">
               <h1>Blocks Page</h1>
            </Route>
         </Switch>
         <BrandName>
            <ViewIcon size="24" /> &nbsp;
            <p>Showing information for {context.brandName} brand</p>
         </BrandName>
      </main>
   )
}
