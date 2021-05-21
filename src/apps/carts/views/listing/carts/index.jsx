import React from 'react'
import { Flex, Text } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'

import { QUERIES } from '../../../graphql'
import tableOptions from '../../../tableOptions'
import { InlineLoader } from '../../../../../shared/components'
import { useTabs, useTooltip } from '../../../../../shared/providers'

export const Carts = () => {
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Carts', '/')
      }
   }, [tab, addTab])

   return (
      <Flex padding="0 16px">
         <Flex as="header" container height="80px" alignItems="center">
            <Text as="h3">Carts</Text>
         </Flex>
         <Listing />
      </Flex>
   )
}

const Listing = () => {
   const { tooltip } = useTooltip()
   const tableRef = React.createRef()
   const { loading, data: { carts = {} } = {} } = useSubscription(
      QUERIES.CART.LIST,
      { variables: { where: { status: { _eq: 'CART_PENDING' } } } }
   )
   const columns = React.useMemo(
      () => [
         {
            width: 100,
            title: 'ID',
            field: 'id',
            headerFilter: true,
            headerTooltip: column => {
               const identifier = 'carts_listing_column_id'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Customer Name',
            formatter: cell => {
               console.log('cell.getData()', cell.getData())
               const { customerInfo = {} } = cell.getData()
               let name = customerInfo?.customerFirstName
               if (customerInfo?.customerLastName) {
                  name += ' ' + customerInfo?.customerLastName
               }
               return name.trim() || 'N/A'
            },
            headerFilter: true,
            headerTooltip: column => {
               const identifier = 'carts_listing_column_customerName'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Customer Email',
            field: 'customerInfo.customerEmail',
            headerFilter: true,
            headerTooltip: column => {
               const identifier = 'carts_listing_column_customerEmail'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Brand',
            field: 'brand.title',
            headerFilter: true,
            headerTooltip: column => {
               const identifier = 'carts_listing_column_brandTitle'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Fulfillment Type',
            formatter: cell => {
               const { fulfillmentInfo = {} } = cell.getData()
               if (!fulfillmentInfo?.type) return 'N/A'
               switch (fulfillmentInfo?.type) {
                  case 'PREORDER_DELIVERY':
                     return 'Pre Order Delivery'
                  case 'PREORDER_PICKUP':
                     return 'Pre Order Pickup'
                  case 'ONDEMAND_PICKUP':
                     return 'On demand Pickup'
                  case 'ONDEMAND_DELIVERY':
                     return 'On Demand Delivery'
                  default:
                     return 'N/A'
               }
            },
            headerFilter: true,
            headerTooltip: column => {
               const identifier = 'carts_listing_column_fulfillmentType'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
      ],
      []
   )
   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={carts.nodes || []}
         options={{
            ...tableOptions,
            placeholder: 'No carts available yet.',
         }}
      />
   )
}
