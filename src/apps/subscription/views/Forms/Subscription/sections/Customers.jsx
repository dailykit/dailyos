import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from 'react-tabulator'

import tableOptions from '../../../../tableOption'
import { SUBSCRIPTION_CUSTOMERS } from '../../../../graphql'
import { InlineLoader } from '../../../../../../shared/components'

const Customers = ({ id, setCustomersTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_customers = [] } = {},
   } = useSubscription(SUBSCRIPTION_CUSTOMERS, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         setCustomersTotal(
            data.subscription_customers.customers.aggregate.count
         )
      },
   })
   const columns = [
      {
         title: 'Name',
         headerFilter: true,
         headerFilterPlaceholder: 'Search by names...',
         formatter: reactFormatter(<CustomerName />),
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
         headerFilterPlaceholder: 'Search by email...',
      },
      {
         title: 'Phone Number',
         headerFilter: true,
         field: 'customer.phoneNumber',
         headerFilterPlaceholder: 'Search by phone numbers...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={subscription_customers.customers.nodes}
         options={{ ...tableOptions, layout: 'fitColumns' }}
      />
   )
}

export default Customers

const CustomerName = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()

   if (!data.customer?.firstName) return 'N/A'
   return (
      <div>
         {data.customer?.firstName} {data.customer?.lastName}
      </div>
   )
}
