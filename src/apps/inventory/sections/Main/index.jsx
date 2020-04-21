import React from 'react'

// State
import { Context } from '../../context/tabs'

// Views
import {
   Home,
   SupplierListing,
   ItemListing,
   SupplierForm,
   ItemForm,
   WorkOrdersListing,
   BulkOrderForm,
} from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'suppliers') return <SupplierListing />
   if (type === 'listings' && view === 'items') return <ItemListing />
   if (type === 'listings' && view === 'orders') return <WorkOrdersListing />
   // Forms
   if (type === 'forms' && view === 'suppliers') return <SupplierForm />
   if (type === 'forms' && view === 'items') return <ItemForm />
   if (type === 'forms' && view === 'bulkOrder') return <BulkOrderForm />
}

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return <main>{renderComponent(state.current.type, state.current.view)}</main>
}

export default Main
