import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { Filler, Loader } from '@dailykit/ui'
import React from 'react'
import { useTooltip } from '../../../../../shared/providers/tooltip'
import { logger } from '../../../../../shared/utils/index'
import { NO_BULK_ITEMS_LISTINGS } from '../../../constants/emptyMessages'
import { useTabs } from '../../../context'
import { SUPPLIER_ITEMS_LISTINGS_BULK } from '../../../graphql'
import tableOptions from '../tableOption'

export default function BulkItemsListings({ tableRef }) {
   const { addTab } = useTabs()
   const {
      loading: itemsLoading,
      data: { bulkItems = [] } = {},
      error,
   } = useSubscription(SUPPLIER_ITEMS_LISTINGS_BULK)
   const { tooltip } = useTooltip()

   if (error) {
      logger(error)
      throw error // let this error catched by the ErrorBoundary as the view requires this.
   }

   const openForm = (_, cell) => {
      const { supplierItem } = cell.getData()
      addTab(supplierItem.name, `/inventory/items/${supplierItem.id}`)
   }

   const columns = [
      {
         title: 'Processing',
         field: 'processingName',
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 150,
         cellClick: openForm,
         headerTooltip: col => {
            const identifier = 'items_listings_bulk_item_processingName'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Item Name',
         field: 'supplierItem.name',
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_item_name'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Supplier',
         field: 'supplierItem.supplier.name',
         headerFilter: false,
         hozAlign: 'center',
         headerHozAlign: 'center',
         headerTooltip: col => {
            const identifier = 'items_listings_supplier'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_bulkItems_par_level'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'On Hand',
         field: 'onHand',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_bulkItems_onHand'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Max Level',
         field: 'maxLevel',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_bulkItems_maxLevel'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Awaiting',
         field: 'awaiting',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_bulkItems_awaiting'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Committed',
         field: 'committed',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
         headerTooltip: col => {
            const identifier = 'items_listings_bulkItems_committed'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   if (itemsLoading) return <Loader />
   if (bulkItems.length)
      return (
         <>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={bulkItems}
               options={{
                  ...tableOptions,
                  groupBy: 'supplierItem.name',
                  selectable: true,
               }}
               style={{ marginTop: '16px' }}
            />
         </>
      )

   return <Filler message={NO_BULK_ITEMS_LISTINGS} />
}
