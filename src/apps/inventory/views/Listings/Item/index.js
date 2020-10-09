import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { IconButton, Loader, Text, TextButton } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import { CREATE_ITEM, SUPPLIER_ITEMS_SUBSCRIPTION } from '../../../graphql'
import { StyledTableActions, StyledTableHeader, StyledWrapper } from '../styled'
const address = 'apps.inventory.views.listings.item.'
export default function ItemListing() {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { loading: itemsLoading, data, error: subError } = useSubscription(
      SUPPLIER_ITEMS_SUBSCRIPTION
   )
   const [createItem] = useMutation(CREATE_ITEM, {
      onCompleted: input => {
         const itemData = input.createSupplierItem.returning[0]
         addTab(itemData.name, `/inventory/items/${itemData.id}`)
         toast.success('Supplier Item Added!')
      },
      onError: error => {
         console.log(error)
         toast.error('Something went wrong, try again')
      },
   })
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
      dataTree: true,
      dataTreeChildField: 'bulkItems',
      dataTreeStartExpanded: true,
      pagination: 'local',
      paginationSize: 10,
   }

   const tableRef = React.useRef()
   const columns = [
      {
         title: 'Supplier Item',
         field: 'name',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
      },
      {
         title: 'Supplier',
         field: 'supplier',
         headerFilter: false,
         formatter: reactFormatter(<SupplierContact />),
         hozAlign: 'center',
         headerHozAlign: 'center',
      },
      {
         title: 'Processing',
         field: 'processingName',
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 150,
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
   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      const tabName = name || row._row.modules.dataTree.parent.data.name
      addTab(tabName, `/inventory/items/${id}`)
   }
   if (itemsLoading) return <Loader />
   if (subError) return <p>{subError.message}</p>
   if (data)
      return (
         <StyledWrapper>
            <StyledTableHeader style={{ marginTop: '30px' }}>
               <Text as="title">Supplier Items</Text>
               <StyledTableActions>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <IconButton type="solid" onClick={createItemHandler}>
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </StyledTableActions>
            </StyledTableHeader>
            <br />
            <br />
            <div>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={data.supplierItems}
                  rowClick={rowClick}
                  options={tableOptions}
                  data-custom-attr="test-custom-attribute"
                  className="custom-css-class"
               />
            </div>
         </StyledWrapper>
      )
}
function SupplierContact({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return '-'
}
