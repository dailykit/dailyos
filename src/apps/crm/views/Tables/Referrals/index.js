import React, { useRef } from 'react'
import { Text, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import options from '../../tableOptions'
import { Tooltip } from '../../../../../shared/components'

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
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         <Flex container height="80px" padding="16px" alignItems="center">
            <Text as="title">Referrals(3)</Text>
            <Tooltip identifier="referral_list_heading" />
         </Flex>

         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            ref={tableRef}
            options={{
               ...options,
               placeholder: 'No Referrals Available Yet !',
            }}
         />
      </Flex>
   )
}

export default ReferralTable
