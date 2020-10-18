import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { Filler, Loader } from '@dailykit/ui'
import React from 'react'
import { logger } from '../../../../../shared/utils/index'
import { NO_BULK_ITEMS_LISTINGS } from '../../../constants/emptyMessages'
import { useTabs } from '../../../context'
import { SUPPLIER_ITEMS_LISTINGS_BULK } from '../../../graphql'

export default function BulkItemsListings({ tableRef }) {
   const { addTab } = useTabs()
   const {
      loading: itemsLoading,
      data: { bulkItems = [] } = {},
      error,
   } = useSubscription(SUPPLIER_ITEMS_LISTINGS_BULK)

   if (error) {
      logger(error)
      throw error // let this error catched by the ErrorBoundary as the view requires this.
   }

   const tableOptions = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      maxHeight: '420px',
      resizableColumns: false,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
      pagination: 'local',
      paginationSize: 10,
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
      },
      {
         title: 'Item Name',
         field: 'supplierItem.name',
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 150,
      },
      {
         title: 'Supplier',
         field: 'supplierItem.supplier.name',
         headerFilter: false,
         hozAlign: 'center',
         headerHozAlign: 'center',
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: 'On Hand',
         field: 'onHand',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: 'Max Level',
         field: 'maxLevel',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: 'Awaiting',
         field: 'awaiting',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: 'Committed',
         field: 'committed',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
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
