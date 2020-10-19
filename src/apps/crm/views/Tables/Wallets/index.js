import React, { useRef } from 'react'
import { Text, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import options from '../../tableOptions'
import { Tooltip } from '../../../../../shared/components'

const WalletTable = () => {
   const { addTab } = useTabs()
   const tableRef = useRef()
   const columns = [
      {
         title: 'Txn Date',
         field: 'date',
         headerFilter: true,
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Reference number',
         field: 'reference',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Order Id',
         field: 'id',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Debit',
         field: 'debit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 100,
      },
      {
         title: 'Credit',
         field: 'credit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 100,
      },
      {
         title: 'Balance',
         field: 'balance',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 100,
      },
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
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         <Flex container height="80px" padding="16px" alignItems="center">
            <Text as="title">Wallet Transactions</Text>
            <Tooltip identifier="wallet_list_heading" />
         </Flex>
         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            ref={tableRef}
            options={{
               ...options,
               placeholder: 'No Wallet Data Available Yet !',
            }}
         />
      </Flex>
   )
}

export default WalletTable
