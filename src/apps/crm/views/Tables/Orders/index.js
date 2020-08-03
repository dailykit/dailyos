/* eslint-disable react/jsx-fragments */
import React, { useState } from 'react'
import { Text } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import OrderPage from './Order'
const OrdersTable = props => {
   const { addTab } = useTabs()
   const [order, setOrder] = useState(false)
   const columns = [
      { title: 'Order Id', field: 'id', headerFilter: true },
      { title: 'Products', field: 'products' },
      { title: 'Wallet Used', field: 'walletUsed' },
      { title: 'Discount', field: 'discount' },
      { title: 'Total Paid', field: 'paid' },
      { title: 'Channel', field: 'channel' },
      { title: 'Ordered On', field: 'orderedOn' },
      { title: 'Delivered On', field: 'deliveredOn' },
   ]
   const data = [
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
   ]
   const rowClick = (e, row) => {
      setOrder(true)
   }
   let showTable = (
      <React.Fragment>
         <div style={{ padding: '16px' }}>
            <Text as="title">Orders(20)</Text>
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
      showTable = <OrderPage />
   }
   return (
      <React.Fragment>
         <div style={{ overflowX: 'scroll' }}>{showTable}</div>
      </React.Fragment>
   )
}

export default OrdersTable
