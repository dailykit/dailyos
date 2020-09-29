import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Payments = ({ update }) => {
   const params = useParams()
   const [settingId, setSettingId] = React.useState(null)
   const [isStoreLive, setIsStoreLive] = React.useState(false)
   const [isStripeConfigured, setIsStripeConfigured] = React.useState(false)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'Store Live' },
         type: { _eq: 'availability' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(onDemandSetting)) {
            const { value, storeSettingId } = onDemandSetting[0]
            setIsStoreLive(value.isStoreLive)
            setIsStripeConfigured(value.isStripeConfigured)
            setSettingId(storeSettingId)
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      update({ id: settingId, value: { isStoreLive, isStripeConfigured } })
   }, [isStoreLive, isStripeConfigured, settingId])

   return (
      <div id="Store Live">
         <Text as="h3">Payments</Text>
         <Spacer size="4px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Toggle
               setChecked={() => {}}
               label="Stripe Configured"
               checked={isStripeConfigured}
            />
            <Toggle
               checked={isStoreLive}
               setChecked={setIsStoreLive}
               label="Accept Live Payments"
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
