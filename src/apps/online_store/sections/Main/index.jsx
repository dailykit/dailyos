import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import {
   Home,
   ProductsListing,
   CollectionForm,
   InventoryProductForm,
   CollectionsListing,
   SimpleRecipeProductForm,
   CustomizableProductForm,
   ComboProductForm,
   StoreSettingsForm,
   RecurrencesForm,
} from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/online-store" exact>
               <Home />
            </Route>
            <Route path="/online-store/products" exact>
               <ProductsListing />
            </Route>
            <Route path="/online-store/inventory-products/:id" exact>
               <InventoryProductForm />
            </Route>
            <Route path="/online-store/simple-recipe-products/:id" exact>
               <SimpleRecipeProductForm />
            </Route>
            <Route path="/online-store/customizable-products/:id" exact>
               <CustomizableProductForm />
            </Route>
            <Route path="/online-store/combo-products/:id" exact>
               <ComboProductForm />
            </Route>
            <Route path="/online-store/collections" exact>
               <CollectionsListing />
            </Route>
            <Route path="/online-store/collections/:id" exact>
               <CollectionForm />
            </Route>
            <Route path="/online-store/settings" exact>
               <StoreSettingsForm />
            </Route>
            <Route path="/online-store/settings/recurrences/:type" exact>
               <RecurrencesForm />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
