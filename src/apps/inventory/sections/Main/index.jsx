import React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

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
   SachetPackaging,
   PackagingPurchaseOrderForm,
} from '../../views'

import PackagingHub from '../../packagingHub'
import PackagingHubProducts from '../../packagingHub/views/Products'
import PackagingHubProductDetails from '../../packagingHub/views/ProductDetails'

//    if (type === 'forms' && view === 'packagingHub') return <PackagingHub />
//       return <PackagingHubProducts />
//    if (type === 'forms' && view === 'packagingHubProductDetailsView')
//       return <PackagingHubProductDetails />

const MainWrapper = styled.main`
   overflow-x: auto;
   position: relative;
`

const Main = () => {
   return (
      <MainWrapper>
         <Switch>
            <Route path="/inventory" exact>
               <Home />
            </Route>
            <Route path="/inventory/suppliers" exact>
               <SupplierListing />
            </Route>
            <Route path="/inventory/suppliers/:id" exact>
               <SupplierForm />
            </Route>
            <Route path="/inventory/items" exact>
               <ItemListing />
            </Route>
            <Route path="/inventory/items/:id" exact>
               <ItemForm />
            </Route>
            <Route path="/inventory/work-orders" exact>
               <WorkOrdersListing />
            </Route>
            <Route path="/inventory/work-orders/sachet/:id" exact>
               <SachetOrderForm />
            </Route>
            <Route path="/inventory/work-orders/bulk/:id" exact>
               <BulkOrderForm />
            </Route>
            <Route path="/inventory/purchase-orders" exact>
               <PurchaseOrdersListing />
            </Route>
            <Route path="/inventory/purchase-orders/item/:id" exact>
               <PurchaseOrderForm />
            </Route>
            <Route path="/inventory/purchase-orders/packaging/:id" exact>
               <PackagingPurchaseOrderForm />
            </Route>
            <Route path="/inventory/packagings" exact>
               <Packagings />
            </Route>
            <Route path="/inventory/packagings/:id" exact>
               <SachetPackaging />
            </Route>
         </Switch>
      </MainWrapper>
   )
}

export default Main
