import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Form } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../../shared/components'

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
         <Flex container alignItems="center">
            <Text as="h3">Loyalty Points Usage</Text>
            <Tooltip identifier="brand_loyaltyPnts_usage_info" />
         </Flex>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="rate" title="rate">
                     <Flex container alignItems="center">
                        Conversion Rate
                        <Tooltip identifier="brand_loyaltyPnts_conversionRate_info" />
                     </Flex>
                  </Form.Label>
                  <Flex container alignItems="center">
                     <p>$</p>
                     <Form.Stepper
                        id="conversionRate"
                        name="conversionRate"
                        value={conversionRate}
                        onChange={e => setConversionRate(+e.target.value)}
                     />
                  </Flex>
               </Form.Group>
            </Flex>
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
         <Spacer size="8px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="percentage" title="percentage">
                     <Flex container alignItems="center">
                        Percent of Total Cart Amount
                        <Tooltip identifier="brand_loyaltyPnts_cartPercentage_info" />
                     </Flex>
                  </Form.Label>
                  <Flex container alignItems="center">
                     <Form.Stepper
                        id="percentage"
                        name="percentage"
                        value={percentage}
                        onChange={e => setPercentage(+e.target.value)}
                     />
                     <p>%</p>
                  </Flex>
               </Form.Group>
            </Flex>
            <Spacer size="12px" xAxis />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="maxAmount" title="maxAmount">
                     <Flex container alignItems="center">
                        Max Amount
                        <Tooltip identifier="brand_loyaltyPnts_maxAmount_info" />
                     </Flex>
                  </Form.Label>
                  <Flex container alignItems="center">
                     <p>$</p>
                     <Form.Stepper
                        id="maxAmount"
                        name="maxAmount"
                        value={max}
                        onChange={e => setMax(+e.target.value)}
                     />
                  </Flex>
               </Form.Group>
            </Flex>
         </Flex>
      </div>
   )
}

export default LoyaltyPointsUsage
