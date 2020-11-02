import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Toggle, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import {
   Flex,
   Tooltip,
   InlineLoader,
} from '../../../../../../../../../shared/components'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../../shared/utils'

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
   const { loading, error } = useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
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

   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }
   if (loading) return <InlineLoader />

   return (
      <div id="priceDisplay">
         <Flex>
            <Flex container alignItems="center">
               <Text as="h3">Plan Labels</Text>
               <Tooltip identifier="brand_price_plan_label_info" />
            </Flex>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Prefix
                        <Tooltip identifier="brand_pricePerPlanPrefix_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="pricePerPlanPrefix"
                     name="pricePerPlanPrefix"
                     value={form.pricePerPlanPrefix}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>

               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Suffix
                        <Tooltip identifier="brand_pricePerPlanSuffix_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="pricePerPlanSuffix"
                     name="pricePerPlanSuffix"
                     value={form.pricePerPlanSuffix}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="16px" />
            <Form.Toggle
               id="pricePerPlanIsVisible"
               name="pricePerPlanIsVisible"
               value={form.pricePerPlanIsVisible}
               onChange={() =>
                  handleChange(
                     'pricePerPlanIsVisible',
                     !form.pricePerPlanIsVisible
                  )
               }
            />

            <Spacer size="24px" />
            <Flex container alignItems="center">
               <Text as="h3">Plan Labels</Text>
               <Tooltip identifier="brand_serving_plan_label_info" />
            </Flex>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Prefix
                        <Tooltip identifier="brand_pricePerServingPrefix_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="pricePerServingPrefix"
                     name="pricePerServingPrefix"
                     value={form.pricePerServingPrefix}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>

               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Suffix
                        <Tooltip identifier="brand_pricePerServingSuffix_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="pricePerServingSuffix"
                     name="pricePerServingSuffix"
                     value={form.pricePerServingSuffix}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="16px" />
            <Form.Toggle
               id="pricePerServingIsVisible"
               name="pricePerServingIsVisible"
               value={form.pricePerServingIsVisible}
               onChange={() =>
                  handleChange(
                     'pricePerServingIsVisible',
                     !form.pricePerServingIsVisible
                  )
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
