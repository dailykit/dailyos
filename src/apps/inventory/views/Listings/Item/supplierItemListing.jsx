import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { Filler, Loader } from '@dailykit/ui'
import React from 'react'
import { useTooltip } from '../../../../../shared/providers/tooltip'
import { logger } from '../../../../../shared/utils/index'
import { NO_SUPPLIER_ITEMS_LISTINGS } from '../../../constants/emptyMessages'
import { useTabs } from '../../../context'
import { SUPPLIER_ITEM_LISTINGS } from '../../../graphql'
import tableOptions from '../tableOption'

export default function SupplierItemsListings({ tableRef }) {
   const { addTab } = useTabs()
   const {
      loading: itemsLoading,
      data: { supplierItems = [] } = {},
      error,
   } = useSubscription(SUPPLIER_ITEM_LISTINGS)

   const { tooltip } = useTooltip()

   if (error) {
      logger(error)
      throw error // let this error catched by the ErrorBoundary as the view requires this.
   }

   const openForm = (_, cell) => {
      const { id, name } = cell.getData()
      addTab(name, `/inventory/items/${id}`)
   }

   const columns = [
      {
         title: 'Item Name',
         field: 'name',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
         cellClick: openForm,
         headerTooltip: col => {
            const identifier = 'items_listings_item_name'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Supplier',
         field: 'supplier.name',
         headerFilter: false,
         headerTooltip: col => {
            const identifier = 'items_listings_supplier'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Bulk Items count',
         field: 'bulkItems_aggregate.aggregate.count',
         headerFilter: false,
         headerTooltip: col => {
            const identifier = 'items_listings_supplier_item_bulkItemCount'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   if (itemsLoading) return <Loader />
   if (supplierItems.length)
      return (
         <>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={supplierItems}
               options={tableOptions}
               style={{ marginTop: '16px' }}
            />
         </>
      )

   return <Filler message={NO_SUPPLIER_ITEMS_LISTINGS} />
}