import React from 'react'
import { Text } from '@dailykit/ui'
import { ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'

const ReferralTable = () => {
   const { addTab } = useTabs()
   const columns = [
      { title: 'Invitation Sent To', field: 'invitation', headerFilter: true },
      { title: 'Email Address', field: 'email' },
      { title: 'Phone Number', field: 'phone' },
      { title: 'Status', field: 'status' },
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
      const { name } = row._row.data

      const param = '/crm/customers/'.concat(name)
      addTab(name, param)
   }
   return (
      <>
         <div style={{ padding: '16px' }}>
            <Text as="title">Refferals(3)</Text>
         </div>
         <div style={{ overflowX: 'scroll' }}>
            <ReactTabulator columns={columns} data={data} rowClick={rowClick} />
         </div>
      </>
   )
}

export default ReferralTable
