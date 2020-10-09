import React, { useRef } from 'react'
import { Text } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'

const ReferralTable = () => {
   const { addTab } = useTabs()
   const tableRef = useRef()
   const columns = [
      {
         title: 'Invitation Sent To',
         field: 'invitation',
         headerFilter: true,
         hozAlign: 'left',
      },
      { title: 'Email Address', field: 'email', hozAlign: 'left' },
      {
         title: 'Phone Number',
         field: 'phone',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      { title: 'Status', field: 'status', hozAlign: 'left', width: 100 },
   ]
   const data = [
      {
         invitation: "Joesheu D'souza",
         email: 'johseu@gmail.com',
         phone: '+1 676 343 2333',
         status: 'PENDING',
      },
      {
         invitation: "Joesheu D'souza",
         email: 'johseu@gmail.com',
         phone: '+1 676 343 2333',
         status: 'PENDING',
      },
      {
         invitation: "Joesheu D'souza",
         email: 'johseu@gmail.com',
         phone: '+1 676 343 2333',
         status: 'PENDING',
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
            <Text as="title">Refferals(3)</Text>
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

export default ReferralTable
const options = {
   cellVertAlign: 'middle',
   maxHeight: '420px',
   layout: 'fitColumns',
   autoResize: true,
   resizableColumns: false,
   virtualDomBuffer: 80,
   placeholder: 'No Data Available',
   persistence: false,
   persistenceMode: 'cookie',
   pagination: 'local',
   paginationSize: 10,
}
