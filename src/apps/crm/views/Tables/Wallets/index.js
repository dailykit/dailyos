import React, { useRef } from 'react'
import { Text } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
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
         width: 200,
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
         width: 200,
      },
      {
         title: 'Debit',
         field: 'debit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Credit',
         field: 'credit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Balance',
         field: 'balance',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
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
      <React.Fragment>
         <div style={{ padding: '16px' }}>
            <Text as="title">Wallet Transactions</Text>
         </div>
         <div style={{ overflowX: 'scroll' }}>
            <ReactTabulator
               columns={columns}
               data={data}
               rowClick={rowClick}
               ref={tableRef}
               options={options}
            />
         </div>
      </React.Fragment>
   )
}

export default WalletTable
const options = {
   cellVertAlign: 'middle',
   maxHeight: '420px',
   layout: 'fitData',
   autoResize: true,
   resizableColumns: false,
   virtualDomBuffer: 80,
   placeholder: 'No Data Available',
   persistence: true,
   persistenceMode: 'cookie',
   pagination: 'local',
   paginationSize: 10,
}
