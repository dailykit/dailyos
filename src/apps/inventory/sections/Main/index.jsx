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
   PurchaseOrdersListing,
   PurchaseOrderForm,
   SachetOrderForm,
   Packagings,
   AssemblyPackaging,
   SachetPackaging,
} from '../../views'

const renderComponent = (type, view) => {
   // Listings
   if (type === 'listings' && view === 'suppliers') return <SupplierListing />
   if (type === 'listings' && view === 'items') return <ItemListing />
   if (type === 'listings' && view === 'orders') return <WorkOrdersListing />
   if (type === 'listings' && view === 'purchaseOrders')
      return <PurchaseOrdersListing />
   if (type === 'listings' && view === 'packagings') return <Packagings />
   // Forms
   if (type === 'forms' && view === 'suppliers') return <SupplierForm />
   if (type === 'forms' && view === 'items') return <ItemForm />
   if (type === 'forms' && view === 'bulkOrder') return <BulkOrderForm />
   if (type === 'forms' && view === 'purchaseOrder')
      return <PurchaseOrderForm />
   if (type === 'forms' && view === 'sachetOrder') return <SachetOrderForm />
   if (type === 'forms' && view === 'sachetPackaging')
      return <SachetPackaging />
   if (type === 'forms' && view === 'assemblyPackaging')
      return <AssemblyPackaging />
}

const Main = () => {
   const { state } = React.useContext(Context)
   if (state.listings.length === 0 && state.forms.length === 0) return <Home />
   return <main>{renderComponent(state.current.type, state.current.view)}</main>
}

export default Main
