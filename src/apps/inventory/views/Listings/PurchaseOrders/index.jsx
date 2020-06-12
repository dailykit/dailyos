import { IconButton, Loader, TextButton } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from 'react-tabulator'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { StyledHeader, StyledWrapper } from '../styled'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const { loading, data: { purchaseOrderItems = [] } = {} } = useSubscription(
      PURCHASE_ORDERS_SUBSCRIPTION,
      {
         onError: error => {
            toast.error('Error! Please try reloading the page')
            console.log(error)
         },
      }
   )

   if (loading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('purchase orders'))}</h1>
               <IconButton
                  type="solid"
                  onClick={() => addTab('New Purchase Order', 'purchaseOrder')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ width: '95%', margin: '0 auto' }}>
               <DataTable
                  data={purchaseOrderItems}
                  addTab={addTab}
                  dispatch={dispatch}
               />
            </div>

            <br />
         </StyledWrapper>
      </>
   )
}

function DataTable({ data, addTab, dispatch }) {
   const tableRef = React.useRef()

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      resizableColumns: true,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
   }

   const rowClick = (e, row) => {
      const { id, status } = row._row.data
      dispatch({
         type: 'SET_PURCHASE_WORK_ORDER',
         payload: {
            id,
            status,
         },
      })
      addTab('Purchase Order', 'purchaseOrder')
   }

   const columns = [
      { title: 'Status', field: 'status', headerFilter: true },
      {
         title: 'Supplier Item',
         field: 'supplierItem',
         headerFilter: false,
         formatter: reactFormatter(<SupplierItemName />),
      },
   ]

   return (
      <div>
         <TextButton
            style={{ marginBottom: '20px' }}
            type="outline"
            onClick={() => tableRef.current.table.clearHeaderFilter()}
         >
            Clear Filters
         </TextButton>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={options}
         />
      </div>
   )
}

function SupplierItemName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return 'NA'
}
