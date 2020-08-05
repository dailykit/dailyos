/* eslint-disable react/jsx-fragments */
import React, { useState } from 'react'
import { Text,Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
import {CUSTOMER} from '../../../graphql'

const OrdersTable = props => {
   const { addTab } = useTabs()
   const { loading: listLoading, data: customerData } = useQuery(CUSTOMER, {
      variables: {
         keycloakId: props.id
      }})
   const [order, setOrder] = useState(false)
   const [orderId, setOrderId] = useState("");
   const columns = [
      { title: 'Order Id', field: 'id', headerFilter: true },
      { title: 'Products', field: 'products' },
      { title: 'Wallet Used', field: 'walletUsed' },
      { title: 'Discount', field: 'discount' },
      { title: 'Total Paid', field: 'amountPaid' },
      { title: 'Channel', field: 'channel' },
      { title: 'Ordered On', field: 'orderedOn' },
      { title: 'Delivered On', field: 'deliveredOn' },
   ]
   const data = [];
   if(customerData){
     customerData.customer.orders.map(order=>{
        const productsCount = order.deliveryInfo.orderInfo.products.length||"0";
      return data.push({
         id: order.id,
         products: productsCount,
         walletUsed: '$1.22',
         discount: order.discount,
         amountPaid: order.amountPaid !==null?`$ ${order.amountPaid}`: "$0",
         channel: 'RMK',
         orderedOn: order.created_at,
         deliveredOn: 'Feb 20, 2020, 17:00',
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
            <Text as="title">Orders({props.count})</Text>
         </div>
         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            // options={tableOptions}
         />
      </React.Fragment>
   )
   if (order) {
      showTable = <OrderPage keycloakId = {props.id} orderId={orderId} backToOrders={()=>setOrder(false)} />
   }

   if (listLoading) return <Loader />
   return (
      <React.Fragment>
         <div style={{ overflowX: 'scroll' }}>{showTable}</div>
      </React.Fragment>
   )
}

export default OrdersTable
