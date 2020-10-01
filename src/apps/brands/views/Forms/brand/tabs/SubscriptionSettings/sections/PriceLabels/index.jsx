import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Toggle, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const PriceLabels = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      pricePerPlanPrefix: '',
      pricePerPlanSuffix: '',
      pricePerPlanIsVisible: false,
      pricePerServingPrefix: '',
      pricePerServingSuffix: '',
      pricePerServingIsVisible: false,
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'priceDisplay' },
         type: { _eq: 'Visual' },
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
            if (!isNull(brand) && !isEmpty(brand)) {
               setForm(form => ({
                  ...form,
                  ...(brand.value?.pricePerPlan && {
                     ...(brand.value?.pricePerPlan?.prefix && {
                        pricePerPlanPrefix: brand.value.pricePerPlan.prefix,
                     }),
                     ...(brand.value?.pricePerPlan?.suffix && {
                        pricePerPlanSuffix: brand.value.pricePerPlan.suffix,
                     }),
                     ...(brand.value?.pricePerPlan?.isVisible && {
                        pricePerPlanIsVisible:
                           brand.value.pricePerPlan.isVisible,
                     }),
                     ...(brand.value?.pricePerServing?.prefix && {
                        pricePerServingPrefix:
                           brand.value.pricePerServing.prefix,
                     }),
                     ...(brand.value?.pricePerServing?.suffix && {
                        pricePerServingSuffix:
                           brand.value.pricePerServing.suffix,
                     }),
                     ...(brand.value?.pricePerServing?.isVisible && {
                        pricePerServingIsVisible:
                           brand.value.pricePerServing.isVisible,
                     }),
                  }),
               }))
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      update({
         id: settingId,
         value: {
            pricePerPlan: {
               prefix: form.pricePerPlanPrefix,
               suffix: form.pricePerPlanSuffix,
               isVisible: form.pricePerPlanIsVisible,
            },
            pricePerServing: {
               prefix: form.pricePerServingPrefix,
               suffix: form.pricePerServingSuffix,
               isVisible: form.pricePerServingIsVisible,
            },
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="priceDisplay">
         <Flex>
            <Text as="h3">Plan Labels</Text>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Input
                  type="text"
                  label="Prefix"
                  name="pricePerPlanPrefix"
                  value={form.pricePerPlanPrefix}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  label="Suffix"
                  name="pricePerPlanSuffix"
                  value={form.pricePerPlanSuffix}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="16px" />
            <Toggle
               label="Visibility"
               checked={form.pricePerPlanIsVisible}
               setChecked={value =>
                  handleChange('pricePerPlanIsVisible', value)
               }
            />
            <Spacer size="24px" />
            <Text as="h3">Plan Labels</Text>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Input
                  type="text"
                  label="Prefix"
                  name="pricePerServingPrefix"
                  value={form.pricePerServingPrefix}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  label="Suffix"
                  name="pricePerServingSuffix"
                  value={form.pricePerServingSuffix}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="16px" />
            <Toggle
               label="Visibility"
               checked={form.pricePerServingIsVisible}
               setChecked={value =>
                  handleChange('pricePerServingIsVisible', value)
               }
            />
            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
