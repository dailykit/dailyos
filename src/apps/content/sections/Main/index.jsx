import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import { BrandName } from './styled'
import BrandContext from '../../context/Brand'
import { ViewIcon } from '../../../../shared/assets/icons'
// Views
import { PageListing, Home } from '../../views'
import { GridForm, FAQForm, Identifier } from '../../views/Forms/'

export default function Main() {
   const [context, setContext] = useContext(BrandContext)
   return (
      <main>
         <Switch>
            <Route path="/content" exact>
               <Home />
            </Route>
            <Route path="/content/pages" exact>
               <PageListing />
            </Route>
            <Route path="/content/pages/:pageName" exact>
               <PageListing />
            </Route>
            {/* <Route path="/content/blocks" exact>
               <Pages />
            </Route>
            <Route exact path="/content/settings">
               <GridForm />
            </Route> */}
         </Switch>
         <BrandName>
            <ViewIcon size="24" /> &nbsp;
            <p>Showing information for {context.brandName} brand</p>
         </BrandName>
      </main>
   )
}
