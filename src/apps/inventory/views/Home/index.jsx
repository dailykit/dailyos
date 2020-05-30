import { DashboardTile, Loader } from '@dailykit/ui'
import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { Context } from '../../context/tabs'
import { StyledHome, StyledTileContainer } from './styled'
import {
   ALL_AVAILABLE_SUPPLIERS_COUNT_SUBSCRIPTION,
   SUPPLIERS_COUNT_SUBSCRIPTION,
   SUPPLIER_ITEMS_COUNT_SUBSCRIPTION,
} from '../../graphql'
import {
   BULK_WORK_ORDERS_COUNT_SUBSCRIPTION,
   SACHET_WORK_ORDERS_COUNT_SUBSCRIPTION,
   PURCHASE_ORDERS_COUNT_SUBSCRIPTION,
   PACKAGINGS_COUNT_SUBSCRIPTION,
} from '../../graphql/subscriptions/index'

const address = 'apps.inventory.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }

   const {
      loading: availableSupplierLoading,
      data: availableSuppliers,
   } = useSubscription(ALL_AVAILABLE_SUPPLIERS_COUNT_SUBSCRIPTION)
   const { loading: suppliersLoading, data: suppliers } = useSubscription(
      SUPPLIERS_COUNT_SUBSCRIPTION
   )
   const { loading: itemsLoading, data: supplierItems } = useSubscription(
      SUPPLIER_ITEMS_COUNT_SUBSCRIPTION
   )
   const { loading: bulkOrdersLoading, data: bulkOrders } = useSubscription(
      BULK_WORK_ORDERS_COUNT_SUBSCRIPTION
   )
   const { loading: sachetLoading, data: sachetOrders } = useSubscription(
      SACHET_WORK_ORDERS_COUNT_SUBSCRIPTION
   )
   const {
      loading: purchaseOrdersLoading,
      data: purchaseOrders,
   } = useSubscription(PURCHASE_ORDERS_COUNT_SUBSCRIPTION)
   const { loading: packagingsLoading, data: packagings } = useSubscription(
      PACKAGINGS_COUNT_SUBSCRIPTION
   )

   if (
      suppliersLoading ||
      itemsLoading ||
      bulkOrdersLoading ||
      sachetLoading ||
      purchaseOrdersLoading ||
      packagingsLoading
   )
      return <Loader />

   return (
      <StyledHome>
         <h1>{t(address.concat('inventory app'))}</h1>
         <StyledTileContainer>
            <DashboardTile
               title={t(address.concat('suppliers'))}
               count={suppliers?.suppliersAggregate?.aggregate?.count}
               conf={`${availableSuppliers?.suppliersAggregate?.aggregate?.count} available`}
               onClick={() => addTab('Suppliers', 'suppliers')}
            />
            <DashboardTile
               title={t(address.concat('items'))}
               count={supplierItems?.supplierItemsAggregate?.aggregate?.count}
               conf="All available"
               onClick={() => addTab('Supplier Items', 'items')}
            />
            <DashboardTile
               title={t(address.concat('work orders'))}
               count={
                  bulkOrders?.bulkWorkOrdersAggregate?.aggregate?.count +
                  sachetOrders?.sachetWorkOrdersAggregate?.aggregate?.count
               }
               conf={`${bulkOrders?.bulkWorkOrdersAggregate?.aggregate?.count} Bulk and ${sachetOrders?.sachetWorkOrdersAggregate?.aggregate?.count} Sachets`}
               onClick={() => addTab('Work Orders', 'orders')}
            />
            <DashboardTile
               title={t(address.concat('purchase orders'))}
               count={
                  purchaseOrders?.purchaseOrderItemsAggregate?.aggregate?.count
               }
               onClick={() => addTab('Purchase Orders', 'purchaseOrders')}
            />
            <DashboardTile
               title="Packagings"
               count={packagings?.packagingAggregate?.aggregate?.count}
               onClick={() => addTab('Packagings', 'packagings')}
            />
         </StyledTileContainer>
      </StyledHome>
   )
}

export default Home
