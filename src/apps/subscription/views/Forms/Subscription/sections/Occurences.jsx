import React from 'react'
import moment from 'moment'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'

import tableOptions from '../../../../tableOption'
import { SUBSCRIPTION_OCCURENCES_LIST } from '../../../../graphql'
import { InlineLoader } from '../../../../../../shared/components'

const Occurences = ({ id, setOccurencesTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_occurences = {} } = {},
   } = useSubscription(SUBSCRIPTION_OCCURENCES_LIST, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const { aggregate } = data.subscription_occurences.occurences_aggregate
         setOccurencesTotal(aggregate.count)
      },
   })

   const columns = [
      {
         title: 'Fulfillment Date',
         field: 'fulfillmentDate',
         formatter: ({ _cell: { value } }) => moment(value).format('MMM DD'),
      },
      {
         title: 'Cut Off Time',
         field: 'cutoffTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         title: 'Start Time',
         field: 'startTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         hozAlign: 'right',
         title: 'Menu Products',
         formatter: reactFormatter(<ProductsCount />),
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         options={{ ...tableOptions, layout: 'fitColumns' }}
         data={subscription_occurences.occurences_aggregate.nodes}
      />
   )
}

export default Occurences

const ProductsCount = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()
   return (
      <div>
         <span title="Added to this occurence">
            {data.products.aggregate.count}
         </span>
         /
         <span title="Added to the subscription">
            {data.subscription.products.aggregate.count}
         </span>
      </div>
   )
}
