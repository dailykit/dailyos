import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Input } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../../graphql'
import { Flex } from '../../../../../../../../../../shared/components'

const LoyaltyPointsUsage = ({ update }) => {
   const params = useParams()
   const [settingId, setSettingId] = React.useState(null)
   const [conversionRate, setConversionRate] = React.useState(1)
   const [percentage, setPercentage] = React.useState(1)
   const [max, setMax] = React.useState(1)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Loyalty Points Usage' },
         type: { _eq: 'rewards' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { storeSettings = [] } = {} } = {},
      }) => {
         if (!isEmpty(storeSettings)) {
            const index = storeSettings.findIndex(
               node => node?.brand?.brandId === Number(params.id)
            )

            if (index === -1) {
               const { id } = storeSettings[0]
               setSettingId(id)
               return
            }
            const { brand, id } = storeSettings[index]
            setSettingId(id)
            if ('conversionRate' in brand.value) {
               setConversionRate(brand.value.conversionRate)
            }
            if ('percentage' in brand.value) {
               setPercentage(brand.value.percentage)
            }
            if ('max' in brand.value) {
               setMax(brand.value.max)
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      update({ id: settingId, value: { conversionRate, percentage, max } })
   }, [conversionRate, percentage, max, settingId])

   return (
      <div id="Loyalty Points Availability">
         <Text as="h3">Loyalty Points Usage</Text>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               $
               <Input
                  type="number"
                  label="Conversion Rate"
                  value={conversionRate}
                  onChange={e => setConversionRate(+e.target.value)}
                  style={{ maxWidth: 200, marginLeft: 8 }}
               />
            </Flex>
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               <Input
                  type="number"
                  label="Percent of Total Cart Amount"
                  value={percentage}
                  onChange={e => setPercentage(+e.target.value)}
                  style={{ maxWidth: 200, marginRight: 8 }}
               />
               %
            </Flex>
            <Flex container alignItems="center">
               $
               <Input
                  type="number"
                  label="Max Amount"
                  value={max}
                  onChange={e => setMax(+e.target.value)}
                  style={{ maxWidth: 200, marginLeft: 8 }}
               />
            </Flex>
         </Flex>
      </div>
   )
}

export default LoyaltyPointsUsage
