import React, { useEffect, useState, useRef } from 'react'
import { Text, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
import { ORDERS_LISTING } from '../../../graphql'

const OrdersTable = ({ id }) => {
   const { dispatch, tab } = useTabs()
   const [orders, setOrders] = useState([])
   const tableRef = useRef(null)
   const history = useHistory()
   const { loading: listLoading, data: ordersList, error } = useQuery(
      ORDERS_LISTING,
      {
         variables: {
            keycloakId: id,
         },
         onCompleted: ({ customer = {} }) => {
            const result = customer.orders.map(order => {
               return {
                  id: order?.id,
                  products: order?.products?.length || '0',
                  walletUsed: 'N/A',
                  discount: order?.discount,
                  amountPaid: `$ ${order?.amountPaid || 'N/A'}`,
                  channel: order?.channel?.cartSource || 'N/A',
                  orderedOn: order?.created_at?.substr(0, 16) || 'N/A',
                  deliveredOn: 'N/A',
               }
            })
            setOrders(result)
         },
      }
   )
   if (error) {
      console.log(error)
   }
   useEffect(() => {
      if (!tab) {
         history.push('/crm/customers')
      }
   }, [history, tab])

   const columns = [
      {
         title: 'Order Id',
         field: 'id',
         headerFilter: true,
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Products',
         field: 'products',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Wallet Used',
         field: 'walletUsed',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Discount',
         field: 'discount',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Total Paid',
         field: 'amountPaid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      { title: 'Channel', field: 'channel', hozAlign: 'left' },
      {
         title: 'Ordered On',
         field: 'orderedOn',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Delivered On',
         field: 'deliveredOn',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
   ]

   const setOrder = React.useCallback(
      (orderId, order) => {
         dispatch({
            type: 'STORE_TAB_DATA',
            payload: {
               path: tab?.path,
               data: { oid: orderId, isOrderClicked: order },
            },
         })
      },
      [tab, dispatch]
   )

   const rowClick = (e, row) => {
      const orderId = row._row.data.id
      setOrder(orderId, true)
   }

   if (listLoading) return <Loader />
   return (
      <div style={{ overflowX: 'scroll' }}>
         {tab.data.isOrderClicked ? (
            <OrderPage />
         ) : (
            <>
               <div style={{ padding: '16px' }}>
                  <Text as="title">
                     Orders(
                     {orders.length})
                  </Text>
               </div>
               {Boolean(orders) && (
                  <ReactTabulator
                     columns={columns}
                     data={orders}
                     rowClick={rowClick}
                     options={options}
                     ref={tableRef}
                  />
               )}
            </>
         )}
      </div>
   )
}

export default OrdersTable
const options = {
   cellVertAlign: 'middle',
   height: '420px',
   layout: 'fitColumns',
   autoResize: true,
   resizableColumns: true,
   virtualDomBuffer: 80,
   placeholder: 'No Data Available',
   persistence: true,
   persistenceMode: 'cookie',
   pagination: 'local',
   paginationSize: 10,
}
