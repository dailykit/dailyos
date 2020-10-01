import React from 'react'
import styled from 'styled-components'
import { isEmpty, isNull } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Spacer,
   Tunnels,
   Tunnel,
   useTunnel,
   TextButton,
} from '@dailykit/ui'

import { AddressTunnel } from '../../../../Tunnels'
import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Address = ({ update }) => {
   const [address, setAddress] = React.useState({})
   const [settingId, setSettingId] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'Location' },
         type: { _eq: 'availability' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { subscriptionSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(subscriptionSetting)) {
            const { brand, id } = subscriptionSetting[0]
            setSettingId(id)
            if (!isNull(brand) && !isEmpty(brand)) {
               setAddress(brand.value)
            }
         }
      },
   })

   return (
      <div id="Location">
         <Text as="h3">Location</Text>
         <Spacer size="16px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Text as="p">{normalizeAddress(address)}</Text>
            <TextButton size="sm" type="outline" onClick={() => openTunnel(1)}>
               Update
            </TextButton>
         </Flex>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <AddressTunnel
                  update={update}
                  address={address}
                  settingId={settingId}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
         </Tunnels>
      </div>
   )
}

const normalizeAddress = (address = {}) => {
   if (isEmpty(address)) return 'No Address added yet!'
   let result = ''
   if (address?.line1) {
      result += address.line1
   }
   if (address?.line2) {
      result += ', ' + address.line2
   }
   if (address?.city) {
      result += ', ' + address.city
   }
   if (address?.state) {
      result += ', ' + address.state
   }
   if (address?.country) {
      result += ', ' + address.country
   }
   if (address?.zipcode) {
      result += ', ' + address.zipcode
   }
   return result
}
