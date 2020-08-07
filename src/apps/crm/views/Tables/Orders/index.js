/* eslint-disable react/jsx-fragments */
import React, { useEffect } from 'react'
import { Text, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
import { ORDERS_LISTING } from '../../../graphql'
import tableOptions from '../../Listings/tableOptions'

const OrdersTable = props => {
   const { addTab, dispatch, tab } = useTabs()
   const history = useHistory()
   const { loading: listLoading, data: ordersListing } = useQuery(
      ORDERS_LISTING,
      {
         variables: {
            keycloakId: props.id,
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
   const setOrderId = orderId => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { orderId },
         },
      })
   }
   const setOrder = order => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { isOrderClicked: order },
         },
      })
   }

   useEffect(() => {
      setOrderId('')
      setOrder(false)
   }, [])

   const data = []
   if (ordersListing) {
      ordersListing.customer.orders.map(order => {
         const productsCount = order.products.length || '0'
         return data.push({
            id: order.id,
            products: productsCount,
            walletUsed: 'N/A',
            discount: order.discount,
            amountPaid:
               order.amountPaid !== null ? `$ ${order.amountPaid}` : '$0',
            channel: 'RMK',
            orderedOn: order.created_at.substr(0, 16),
            deliveredOn: 'N/A',
         })
      })
   }
   const rowClick = (e, row) => {
      const orderId = row._row.data.id
      setOrderId(orderId)
      setOrder(true)
   }
   let showTable = (
      <React.Fragment>
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
      </React.Fragment>
   )
   if (tab.data.isOrderClicked) {
      showTable = <OrderPage keycloakId={props.id} />
   }

   if (listLoading) return <Loader />
   return (
      <React.Fragment>
         <div style={{ overflowX: 'scroll' }}>{showTable}</div>
      </React.Fragment>
   )
}

export default OrdersTable
