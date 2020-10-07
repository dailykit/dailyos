import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Coupons = ({ update }) => {
   const params = useParams()
   const [settingId, setSettingId] = React.useState(null)
   const [isAvailable, setIsAvailable] = React.useState(false)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'Coupons' },
         type: { _eq: 'rewards' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { subscriptionSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(subscriptionSetting)) {
            const index = subscriptionSetting.findIndex(
               node => node?.brand?.brandId === Number(params.id)
            )

            if (index === -1) {
               const { id } = subscriptionSetting[0]
               setSettingId(id)
               return
            }
            const { brand, id } = subscriptionSetting[index]
            setSettingId(id)
            if ('isAvailable' in brand.value) {
               setIsAvailable(brand.value.isAvailable)
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      update({ id: settingId, value: { isAvailable } })
   }, [isAvailable, settingId])

   return (
      <div id="Coupons">
         <Text as="h3">Coupons Availablility</Text>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Toggle
               label="Available"
               checked={isAvailable}
               setChecked={setIsAvailable}
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
