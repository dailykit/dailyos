import { useMutation, useSubscription } from '@apollo/react-hooks'
import { IconButton, Loader, TextButton, Text } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'

import { randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { CREATE_ITEM, SUPPLIER_ITEMS_SUBSCRIPTION } from '../../../graphql'
import { StyledTableActions, StyledTableHeader, StyledWrapper } from '../styled'

const address = 'apps.inventory.views.listings.item.'

export default function ItemListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

   const { loading: itemsLoading, data, error: subError } = useSubscription(
      SUPPLIER_ITEMS_SUBSCRIPTION
   )

   const [createItem] = useMutation(CREATE_ITEM, {
      onCompleted: input => {
         const itemData = input.createSupplierItem.returning[0]
         addTab(itemData.name, 'items', itemData.id)
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
      maxHeight: 420,
      resizableColumns: true,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
      dataTree: true,
      dataTreeChildField: 'bulkItems',
      dataTreeStartExpanded: true,
   }

   const tableRef = React.useRef()

   const columns = [
      {
         title: 'Supplier Item',
         field: 'name',
         headerFilter: true,
      },
      {
         title: 'Supplier',
         field: 'supplier',
         headerFilter: false,
         formatter: reactFormatter(<SupplierContact />),
         hozAlign: 'center',
      },
      {
         title: 'Processing',
         field: 'processingName',
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'On Hand',
         field: 'onHand',
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Max Level',
         field: 'maxLevel',
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Awaiting',
         field: 'awaiting',
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Committed',
         field: 'committed',
         headerFilter: false,
         hozAlign: 'center',
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      const tabName = name || row._row.modules.dataTree.parent.data.name
      addTab(tabName, 'items', id)
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
                  <IconButton
                     data-testid="addItem"
                     type="solid"
                     onClick={createItemHandler}
                  >
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </StyledTableActions>
            </StyledTableHeader>
            <br />
            <br />
            <div style={{ width: '90%', margin: '0 auto' }}>
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
