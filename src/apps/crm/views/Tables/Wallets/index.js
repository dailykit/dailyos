/* eslint-disable react/jsx-fragments */
import React from 'react'
import { Text } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'

const WalletTable = props => {
   const { addTab } = useTabs()
   const columns = [
      { title: 'Txn Date', field: 'date', headerFilter: true },
      { title: 'Reference number', field: 'reference' },
      { title: 'Order Id', field: 'id' },
      { title: 'Debit', field: 'debit' },
      { title: 'Credit', field: 'credit' },
      { title: 'Balance', field: 'balance' },
   ]
   const data = [
      {
         date: 'May 9, 2020',
         reference: '#1345435435',
         id: '#1354434354',
         debit: '$2.2',
         credit: '$1.1',
         balance: '$8',
      },
      {
         date: 'May 9, 2020',
         reference: '#1345435435',
         id: '#1354434354',
         debit: '$2.2',
         credit: '$1.1',
         balance: '$8',
      },
      {
         date: 'May 9, 2020',
         reference: '#1345435435',
         id: '#1354434354',
         debit: '$2.2',
         credit: '$1.1',
         balance: '$8',
      },
      {
         date: 'May 9, 2020',
         reference: '#1345435435',
         id: '#1354434354',
         debit: '$2.2',
         credit: '$1.1',
         balance: '$8',
      },
   ]
   const rowClick = (e, row) => {
      const { id, name } = row._row.data

      const param = '/crm/customers/'.concat(name)
      addTab(name, param)
   }
   return (
      <React.Fragment>
         <div style={{ padding: '16px' }}>
            <Text as="title">Wallet Transactions</Text>
         </div>
         <div style={{ overflowX: 'scroll' }}>
            <ReactTabulator
               columns={columns}
               data={data}
               rowClick={rowClick}
               // options={tableOptions}
            />
         </div>
      </React.Fragment>
   )
}

export default WalletTable
