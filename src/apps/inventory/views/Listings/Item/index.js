import { useMutation, useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { ComboButton, Loader, Text, TextButton } from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { logger, randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { useTabs } from '../../../context'
import { CREATE_ITEM, SUPPLIER_ITEMS_LISTINGS } from '../../../graphql'
import { StyledTableActions, StyledTableHeader, StyledWrapper } from '../styled'

export default function ItemListing() {
   const { addTab } = useTabs()
   const {
      loading: itemsLoading,
      data: { bulkItems = [] } = {},
      error,
   } = useSubscription(SUPPLIER_ITEMS_LISTINGS)

   const [createItem] = useMutation(CREATE_ITEM, {
      onCompleted: input => {
         const itemData = input.createSupplierItem.returning[0]
         addTab(itemData.name, `/inventory/items/${itemData.id}`)
         toast.success('Supplier Item Added!')
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
   })

   if (error) {
      logger(error)
      throw error // let this error catched by the ErrorBoundary as the view requires this.
   }

   const createItemHandler = () => {
      // create item in DB
      const name = `item-${randomSuffix()}`
      createItem({
         variables: {
            object: {
               name,
            },
         },
      })
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

   const tableRef = React.useRef()

   const openForm = (_, cell) => {
      const { id, supplierItem } = cell.getData()
      addTab(supplierItem.name, `/inventory/items/${id}`)
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
         <StyledWrapper>
            <StyledTableHeader>
               <Text as="title">Supplier Items</Text>
               <StyledTableActions>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <ComboButton type="solid" onClick={createItemHandler}>
                     <AddIcon color="#fff" size={24} /> Add Item
                  </ComboButton>
               </StyledTableActions>
            </StyledTableHeader>
            <br />
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={bulkItems}
               options={{
                  ...tableOptions,
                  groupBy: 'supplierItem.name',
                  selectable: true,
               }}
            />
         </StyledWrapper>
      )
}
