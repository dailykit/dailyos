import React, { useEffect } from 'react'
import { Text, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
import { ORDERS_LISTING } from '../../../graphql'
import tableOptions from '../../Listings/tableOptions'

const OrdersTable = ({ id }) => {
   const { dispatch, tab } = useTabs()
   const history = useHistory()
   const { loading: listLoading, data: ordersListing } = useQuery(
      ORDERS_LISTING,
      {
         variables: {
            keycloakId: id,
         },
      }
   )
   useEffect(() => {
      if (!tab) {
         history.push('/crm/customers')
      }
   }, [history, tab])

   const columns = [
      { title: 'Order Id', field: 'id', headerFilter: true },
      { title: 'Products', field: 'products' },
      { title: 'Wallet Used', field: 'walletUsed' },
      { title: 'Discount', field: 'discount' },
      { title: 'Total Paid', field: 'amountPaid' },
      { title: 'Channel', field: 'channel' },
      { title: 'Ordered On', field: 'orderedOn', align: 'left' },
      { title: 'Delivered On', field: 'deliveredOn', align: 'center' },
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

   useEffect(() => {
      setOrder('', false)
   }, [setOrder])

   const data = []
   if (ordersListing) {
      ordersListing.customer.orders.map(order => {
         return data.push({
            id: order?.id,
            products: order?.products?.length || '0',
            walletUsed: 'N/A',
            discount: order?.discount,
            amountPaid: `$ ${order?.amountPaid || 'N/A'}`,
            channel: order?.channel?.cartSource || 'N/A',
            orderedOn: order?.created_at?.substr(0, 16) || 'N/A',
            deliveredOn: 'N/A',
         })
      })
   }
   const rowClick = (e, row) => {
      const orderId = row._row.data.id

      setOrder(orderId, true)
   }
   let showTable = (
      <>
         <div style={{ padding: '16px' }}>
            <Text as="title">
               Orders(
               {ordersListing?.customer?.orders_aggregate?.aggregate?.count ||
                  'N/A'}
               )
            </Text>
         </div>
         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={tableOptions}
         />
      </>
   )
   if (tab.data.isOrderClicked) {
      showTable = <OrderPage keycloakId={id} />
   }

   if (listLoading) return <Loader />
   return (
      <>
         <div style={{ overflowX: 'scroll' }}>{showTable}</div>
      </>
   )
}

export default OrdersTable
