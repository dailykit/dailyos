import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Text, IconButton, PlusIcon } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'

import { Flex } from '../../../../components'
import tableOptions from '../../../../tableOption'
import { SUBSCRIPTION_ZIPCODES } from '../../../../graphql'
import { InlineLoader } from '../../../../../../shared/components'

const DeliveryAreas = ({ id, setAreasTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_zipcodes = [] } = {},
   } = useSubscription(SUBSCRIPTION_ZIPCODES, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         setAreasTotal(data.subscription_zipcodes.length)
      },
   })
   const columns = [
      {
         title: 'Zipcode',
         field: 'zipcode',
         headerFilter: true,
         headerFilterPlaceholder: 'Search zipcodes...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <>
         <Flex container justify="space-between">
            <Text as="title">Delivery Areas</Text>
            <IconButton type="outline">
               <PlusIcon />
            </IconButton>
         </Flex>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={subscription_zipcodes}
            options={{ ...tableOptions, layout: 'fitColumns' }}
         />
      </>
   )
}

export default DeliveryAreas
