import React, { useEffect, useState, useRef } from 'react'
import { Text, Loader, Flex } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
import { ORDERS_LISTING } from '../../../graphql'
import { Tooltip } from '../../../../../shared/components'
import options from '../../tableOptions'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'

const OrdersTable = ({ id }) => {
   const { dispatch, tab } = useTabs()
   const [orders, setOrders] = useState([])
   const tableRef = useRef(null)
   const history = useHistory()
   const { loading: listLoading, data: ordersList } = useQuery(ORDERS_LISTING, {
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
      onError: error => {
         toast.error('Something went wrong !')
         logger(error)
      },
   })
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
         cssClass: 'rowClick',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         cellClick: (e, cell) => {
            rowClick(e, cell)
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
         width: 150,
      },
      {
         title: 'Wallet Used',
         field: 'walletUsed',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Discount',
         field: 'discount',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Total Paid',
         field: 'amountPaid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
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
         width: 150,
      },
      {
         title: 'Delivered On',
         field: 'deliveredOn',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
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

   const rowClick = (e, cell) => {
      const orderId = cell._cell.row.data.id
      setOrder(orderId, true)
   }

   if (listLoading) return <Loader />
   return (
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         {tab.data.isOrderClicked ? (
            <OrderPage />
         ) : (
            <>
               <Flex container alignItems="center">
                  <Text as="title">
                     Orders(
                     {orders.length})
                  </Text>
                  <Tooltip identifier="order_list_heading" />
               </Flex>
               {Boolean(orders) && (
                  <ReactTabulator
                     columns={columns}
                     data={orders}
                     options={{
                        ...options,
                        placeholder: 'No Order Available Yet !',
                     }}
                     ref={tableRef}
                  />
               )}
            </>
         )}
      </Flex>
   )
}

export default OrdersTable
