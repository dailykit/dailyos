import React from 'react'
import { toast } from 'react-toastify'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Form,
   Flex,
   Text,
   Tunnel,
   Tunnels,
   Spacer,
   PlusIcon,
   useTunnel,
   IconButton,
   TunnelHeader,
} from '@dailykit/ui'

import { usePlan } from '../state'
import tableOptions from '../../../../tableOption'
import { logger } from '../../../../../../shared/utils'
import { useTooltip } from '../../../../../../shared/providers'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../../shared/components'
import {
   SUBSCRIPTION_ZIPCODES,
   INSERT_SUBSCRIPTION_ZIPCODES,
} from '../../../../graphql'

const DeliveryAreas = ({ id, setAreasTotal }) => {
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const {
      error,
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
         headerTooltip: column => {
            const identifier = 'listing_delivery_areas_column_fulfillment'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         field: 'deliveryPrice',
         title: 'Delivery Price',
         headerFilter: true,
         headerFilterPlaceholder: 'Search prices...',
         headerTooltip: column => {
            const identifier = 'listing_delivery_areas_column_zipcode'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         field: 'isActive',
         title: 'Active',
         formatter: 'tick',
         headerTooltip: column => {
            const identifier = 'listing_delivery_areas_column_active'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
   ]

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Failed to fetch the list of delivery areas!')
      logger(error)
      return (
         <ErrorState message="Failed to fetch the list of delivery areas!" />
      )
   }
   return (
      <>
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               <Text as="h3">Delivery Areas</Text>
               <Tooltip identifier="form_subscription_section_delivery_day_section_delivery_areas" />
            </Flex>
            <IconButton type="outline" onClick={() => openTunnel(1)}>
               <PlusIcon />
            </IconButton>
         </Flex>
         <Spacer size="16px" />
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={subscription_zipcodes}
            options={{ ...tableOptions, layout: 'fitColumns' }}
         />
         <AreasTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
      </>
   )
}

export default DeliveryAreas

const AreasTunnel = ({ tunnels, closeTunnel }) => {
   const { state } = usePlan()
   const [price, setPrice] = React.useState('')
   const [zipcodes, setZipcodes] = React.useState('')
   const [insertSubscriptionZipcodes] = useMutation(
      INSERT_SUBSCRIPTION_ZIPCODES,
      {
         onCompleted: () => {
            closeTunnel(1)
            toast.success('Successfully created the delivery areas!')
         },
         onError: error => {
            logger(error)
            toast.success('Failed to create the delivery areas!')
         },
      }
   )

   const save = () => {
      const zips = zipcodes.split(',').map(node => node.trim())
      const objects = zips.map(zip => ({
         zipcode: zip,
         deliveryPrice: Number(price),
         subscriptionId: state.subscription.id,
      }))
      insertSubscriptionZipcodes({
         variables: {
            objects,
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer="1">
            <TunnelHeader
               title="Add Zipcodes"
               close={() => closeTunnel(1)}
               right={{ action: () => save(), title: 'Save' }}
               tooltip={
                  <Tooltip identifier="form_subscription_tunnel_zipcode_heading" />
               }
            />
            <Flex padding="16px">
               <Form.Group>
                  <Form.Label htmlFor="zipcodes" title="zipcodes">
                     <Flex container alignItems="center">
                        Zipcodes*
                        <Tooltip identifier="form_subscription_tunnel_zipcode_field_zipcode" />
                     </Flex>
                  </Form.Label>
                  <Form.TextArea
                     id="zipcodes"
                     name="zipcodes"
                     value={zipcodes}
                     placeholder="Enter the zipcodes"
                     onChange={e => setZipcodes(e.target.value)}
                  />
               </Form.Group>
               <Form.Hint>Enter comma seperated zipcodes.</Form.Hint>
               <Spacer size="24px" />
               <Form.Group>
                  <Form.Label htmlFor="price" title="price">
                     <Flex container alignItems="center">
                        Price*
                        <Tooltip identifier="form_subscription_tunnel_zipcode_field_price" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="price"
                     name="price"
                     value={price}
                     placeholder="Enter the price"
                     onChange={e => setPrice(e.target.value)}
                  />
               </Form.Group>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}
