import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const PrimaryColor = ({ update }) => {
   const params = useParams()
   const [color, setColor] = React.useState('#3fa4ff')
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'Primary Color' },
         type: { _eq: 'visual' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(onDemandSetting)) {
            const { value, storeSettingId } = onDemandSetting[0]
            setColor(value.color)
            setSettingId(storeSettingId)
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      update({ id: settingId, value: { color } })
   }, [color, settingId])

   return (
      <div id="Primary Color">
         <Text as="h3">Primary Color</Text>
         <Spacer size="4px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <input
               type="color"
               label=""
               name="color"
               value={color}
               onChange={e => setColor(e.target.value)}
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
