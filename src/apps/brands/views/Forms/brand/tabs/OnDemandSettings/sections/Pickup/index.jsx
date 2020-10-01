import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Pickup = ({ update }) => {
   const params = useParams()
   const [settingId, setSettingId] = React.useState(null)
   const [isAvailable, setIsAvailable] = React.useState(false)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Pickup Availability' },
         type: { _eq: 'availability' },
         brandId: { _eq: params.id },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { storeSettings = [] } = {} } = {},
      }) => {
         if (!isEmpty(storeSettings)) {
            const { brand, id } = storeSettings[0]
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
      <div id="Pickup Availability">
         <Text as="h3">Pick Up</Text>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Toggle
               checked={isAvailable}
               setChecked={setIsAvailable}
               label="Available"
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
