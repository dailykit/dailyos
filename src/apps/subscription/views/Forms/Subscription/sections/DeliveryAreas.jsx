import React from 'react'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Text,
   Input,
   Tunnel,
   Tunnels,
   PlusIcon,
   useTunnel,
   HelperText,
   IconButton,
   TunnelHeader,
} from '@dailykit/ui'

import { usePlan } from '../state'
import { Spacer } from '../../../../styled'
import { Flex } from '../../../../components'
import tableOptions from '../../../../tableOption'
import { InlineLoader } from '../../../../../../shared/components'
import {
   SUBSCRIPTION_ZIPCODES,
   INSERT_SUBSCRIPTION_ZIPCODES,
} from '../../../../graphql'

const DeliveryAreas = ({ id, setAreasTotal }) => {
   const tableRef = React.useRef()
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
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
      {
         field: 'deliveryPrice',
         title: 'Delivery Price',
         headerFilter: true,
         headerFilterPlaceholder: 'Search zipcodes...',
      },
      {
         field: 'isActive',
         title: 'Active',
         formatter: 'tick',
         headerFilter: true,
         headerFilterPlaceholder: 'Search zipcodes...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <>
         <Flex container alignItems="center" justifyContent="space-between">
            <Text as="title">Delivery Areas</Text>
            <IconButton type="outline" onClick={() => openTunnel(1)}>
               <PlusIcon />
            </IconButton>
         </Flex>
         <Spacer size="24px" />
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
            />
            <main style={{ padding: 16 }}>
               <Input
                  rows="5"
                  type="textarea"
                  name="zipcodes"
                  label="Zip Codes"
                  value={zipcodes}
                  onChange={e => setZipcodes(e.target.value)}
               />
               <HelperText
                  type="hint"
                  message="Enter comma seperated zipcodes."
               />
               <Spacer size="24px" />
               <Input
                  type="text"
                  name="price"
                  label="Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
               />
            </main>
         </Tunnel>
      </Tunnels>
   )
}
