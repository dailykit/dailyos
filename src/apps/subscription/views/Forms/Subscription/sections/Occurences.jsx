import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import { Flex, Text, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'

import tableOptions from '../../../../tableOption'
import { logger } from '../../../../../../shared/utils'
import { useTooltip } from '../../../../../../shared/providers'
import { SUBSCRIPTION_OCCURENCES_LIST } from '../../../../graphql'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../../shared/components'

const Occurences = ({ id, setOccurencesTotal }) => {
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()
   const {
      error,
      loading,
      data: { subscription_occurences = {} } = {},
   } = useSubscription(SUBSCRIPTION_OCCURENCES_LIST, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const {
            aggregate = {},
         } = data.subscription_occurences?.occurences_aggregate
         setOccurencesTotal(aggregate?.count || 0)
      },
   })

   const columns = [
      {
         title: 'Fulfillment Date',
         field: 'fulfillmentDate',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD, YYYY'),
         headerTooltip: column => {
            const identifier = 'listing_occurences_column_fulfillment'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Cut Off Time',
         field: 'cutoffTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD, YYYY HH:mm A'),
         headerTooltip: column => {
            const identifier = 'listing_occurences_column_cutoff'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Start Time',
         field: 'startTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD, YYYY HH:mm A'),
         headerTooltip: column => {
            const identifier = 'listing_occurences_column_start'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         hozAlign: 'right',
         title: 'Add On Products',
         formatter: reactFormatter(<AddOnProductsCount />),
         headerTooltip: column => {
            const identifier = 'listing_occurences_column_products'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         hozAlign: 'right',
         title: 'Menu Products',
         formatter: reactFormatter(<ProductsCount />),
         headerTooltip: column => {
            const identifier = 'listing_occurences_column_products'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
   ]

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Failed to fetch the list of occurences!')
      logger(error)
      return <ErrorState message="Failed to fetch the list of occurences!" />
   }
   return (
      <>
         <Flex container alignItems="center">
            <Text as="h3">Occurences</Text>
            <Tooltip identifier="form_subscription_section_delivery_day_section_occurences" />
         </Flex>
         <Spacer size="16px" />
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            options={{ ...tableOptions, layout: 'fitColumns' }}
            data={subscription_occurences?.occurences_aggregate?.nodes || []}
         />
      </>
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

const AddOnProductsCount = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()
   return (
      <div>
         <span title="Added to this occurence">
            {data.addOnProducts.aggregate.count}
         </span>
         /
         <span title="Added to the subscription">
            {data.subscription.addOnProducts.aggregate.count}
         </span>
      </div>
   )
}
