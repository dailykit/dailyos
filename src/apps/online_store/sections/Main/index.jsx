import React from 'react'

// State
import { Context } from '../../context/tabs'

// Views
import {
   Home,
   ProductsListing,
   ProductForm,
   CollectionForm,
   InventoryProductForm,
   CollectionsListing,
   SimpleRecipeProductForm,
   CustomizableProductForm,
   ComboProductForm,
} from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'products') return <ProductsListing />
   if (type === 'listings' && view === 'collections')
      return <CollectionsListing />
   // Forms
   if (type === 'forms' && view === 'product') return <ProductForm />
   if (type === 'forms' && view === 'collection') return <CollectionForm />
   if (type === 'forms' && view === 'inventoryProduct')
      return <InventoryProductForm />
   if (type === 'forms' && view === 'simpleRecipeProduct')
      return <SimpleRecipeProductForm />
   if (type === 'forms' && view === 'customizableProduct')
      return <CustomizableProductForm />
   if (type === 'forms' && view === 'comboProduct') return <ComboProductForm />
}

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return <main>{renderComponent(state.current.type, state.current.view)}</main>
}

export default Main
