import React from 'react'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
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
import { DeleteIcon } from '../../../../../../shared/assets/icons'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../../shared/components'
import {
   ZIPCODE,
   SUBSCRIPTION_ZIPCODES,
   INSERT_SUBSCRIPTION_ZIPCODES,
} from '../../../../graphql'

const DeliveryAreas = ({ id, setAreasTotal }) => {
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [remove] = useMutation(ZIPCODE.DELETE, {
      onCompleted: () => {
         toast.success('Successfully deleted the zipcode!')
      },
      onError: error => {
         toast.success('Failed to delete the zipcode!')
         logger(error)
      },
   })
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
         title: 'Delivery From',
         headerFilter: true,
         headerTooltip: column => {
            const identifier = 'listing_delivery_from_column_zipcode'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         formatter: cell => cell.getData().deliveryTime.from,
      },
      {
         title: 'Delivery To',
         headerFilter: true,
         headerTooltip: column => {
            const identifier = 'listing_delivery_from_column_zipcode'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         formatter: cell => cell.getData().deliveryTime.to,
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
      {
         width: 150,
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cssClass: 'center-text',
         formatter: reactFormatter(<Delete remove={remove} />),
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
         <Flex
            height="48px"
            container
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center">
               <Text as="h3">Delivery Areas</Text>
               <Tooltip identifier="form_subscription_section_delivery_day_section_delivery_areas" />
            </Flex>
            <IconButton size="sm" type="outline" onClick={() => openTunnel(1)}>
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
         <Tunnels tunnels={tunnels}>
            <Tunnel layer="1">
               <AreasTunnel id={id} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default DeliveryAreas

const AreasTunnel = ({ id, closeTunnel }) => {
   const { state } = usePlan()
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [price, setPrice] = React.useState('')
   const [zipcodes, setZipcodes] = React.useState('')
   const [insertSubscriptionZipcodes, { loading }] = useMutation(
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
         deliveryTime: {
            from,
            to,
         },
         subscriptionId: id,
      }))
      insertSubscriptionZipcodes({
         variables: {
            objects,
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Add Zipcodes"
            close={() => closeTunnel(1)}
            right={{
               title: 'Save',
               isLoading: loading,
               action: () => save(),
               disabled: !zipcodes || !price || !from || !to,
            }}
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
            <Spacer size="24px" />
            <Form.Group>
               <Form.Label htmlFor="from" title="from">
                  <Flex container alignItems="center">
                     Delivery From*
                     <Tooltip identifier="form_subscription_tunnel_zipcode_field_delivery_from" />
                  </Flex>
               </Form.Label>
               <Form.Time
                  id="from"
                  name="from"
                  value={from}
                  placeholder="Enter delivery from"
                  onChange={e => setFrom(e.target.value)}
               />
            </Form.Group>
            <Spacer size="24px" />
            <Form.Group>
               <Form.Label htmlFor="to" title="to">
                  <Flex container alignItems="center">
                     Delivery To*
                     <Tooltip identifier="form_subscription_tunnel_zipcode_field_delivery_to" />
                  </Flex>
               </Form.Label>
               <Form.Time
                  id="to"
                  name="to"
                  value={to}
                  placeholder="Enter delivery to"
                  onChange={e => setTo(e.target.value)}
               />
            </Form.Group>
         </Flex>
      </>
   )
}

const Delete = ({ cell, remove }) => {
   const removeItem = () => {
      const { subscriptionId, zipcode } = cell.getData()
      if (
         window.confirm(`Are your sure you want to delete ${zipcode} zipcode?`)
      ) {
         remove({ variables: { subscriptionId, zipcode } })
      }
   }

   return (
      <IconButton size="sm" type="ghost" onClick={removeItem}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}
