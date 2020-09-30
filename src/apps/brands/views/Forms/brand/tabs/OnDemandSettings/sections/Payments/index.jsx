import React from 'react'
import { isEmpty } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Payments = ({ update }) => {
   const [settingId, setSettingId] = React.useState(null)
   const [isStoreLive, setIsStoreLive] = React.useState(false)
   const [isStripeConfigured, setIsStripeConfigured] = React.useState(false)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Store Live' },
         type: { _eq: 'availability' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { storeSettings = [] } = {} } = {},
      }) => {
         if (!isEmpty(storeSettings)) {
            const { brand, id } = storeSettings[0]
            setSettingId(id)
            if ('isStoreLive' in brand.value) {
               setIsStoreLive(brand.value.isStoreLive)
            }
            if ('isStripeConfigured' in brand.value) {
               setIsStripeConfigured(brand.value.isStripeConfigured)
            }
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
               isDisabled
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
