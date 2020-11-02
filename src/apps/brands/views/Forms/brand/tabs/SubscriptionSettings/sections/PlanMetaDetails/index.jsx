import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

export const PlanMetaDetails = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      selectButtonLabel: '',
      subscriptionTitleThumbnail: false,
      subscriptionTitleDescription: false,
      subscriptionYieldInformation: '',
      subscriptionItemCountTotal: false,
      subscriptionItemCountPerServing: false,
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'subscription-metadetails' },
         type: { _eq: 'Select-Plan' },
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
                  ...(brand.value?.selectButtonLabel && {
                     selectButtonLabel: brand.value.selectButtonLabel,
                  }),
                  ...(brand.value?.subscriptionYield && {
                     ...(brand.value?.subscriptionYield?.information && {
                        subscriptionYieldInformation:
                           brand.value.subscriptionYield.information,
                     }),
                  }),
                  ...(brand.value?.subscriptionTitle && {
                     ...(brand.value?.subscriptionTitle?.thumbnail && {
                        subscriptionTitleThumbnail:
                           brand.value.subscriptionTitle.thumbnail,
                     }),
                     ...(brand.value?.subscriptionTitle?.description && {
                        subscriptionTitleDescription:
                           brand.value.subscriptionTitle.description,
                     }),
                  }),
                  ...(brand.value?.subscriptionItemCount && {
                     ...(brand.value?.subscriptionItemCount?.total && {
                        subscriptionItemCountTotal:
                           brand.value.subscriptionItemCount.total,
                     }),
                     ...(brand.value?.subscriptionItemCount?.perServing && {
                        subscriptionItemCountPerServing:
                           brand.value.subscriptionItemCount.perServing,
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
            selectButtonLabel: form.selectButtonLabel,
            subscriptionTitle: {
               thumbnail: form.subscriptionTitleThumbnail,
               description: form.subscriptionTitleDescription,
            },
            subscriptionYield: {
               information: form.subscriptionYieldInformation,
            },
            subscriptionItemCount: {
               total: form.subscriptionItemCountTotal,
               perServing: form.subscriptionItemCountPerServing,
            },
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="subscription-metadetails">
         <Flex>
            <Form.Group>
               <Form.Label htmlFor="label" title="label">
                  <Flex container alignItems="center">
                     Select Button Label
                     <Tooltip identifier="brand_selectButtonLabel_info" />
                  </Flex>
               </Form.Label>
               <Form.Text
                  id="selectButtonLabel"
                  name="selectButtonLabel"
                  value={form.selectButtonLabel}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Form.Group>

            <Spacer size="24px" />
            <Flex>
               <Form.Toggle
                  id="subscriptionTitleDescription"
                  name="subscriptionTitleDescription"
                  value={form.subscriptionTitleDescription}
                  onChange={() =>
                     handleChange(
                        'subscriptionTitleDescription',
                        !form.subscriptionTitleDescription
                     )
                  }
               >
                  Show plan description
               </Form.Toggle>

               <Spacer size="16px" />
               <Form.Toggle
                  id="subscriptionTitleThumbnail"
                  name="subscriptionTitleThumbnail"
                  value={form.subscriptionTitleThumbnail}
                  onChange={() =>
                     handleChange(
                        'subscriptionTitleThumbnail',
                        !form.subscriptionTitleThumbnail
                     )
                  }
               >
                  Show plan thumbnail
               </Form.Toggle>
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Flex container alignItems="center">
                  <Text as="h3">Plan Item Counts</Text>
                  <Tooltip identifier="brand_itemCount_label_info" />
               </Flex>
               <Spacer size="16px" />
               <Form.Toggle
                  id="subscriptionItemCountTotal"
                  name="subscriptionItemCountTotal"
                  value={form.subscriptionItemCountTotal}
                  onChange={() =>
                     handleChange(
                        'subscriptionItemCountTotal',
                        !form.subscriptionItemCountTotal
                     )
                  }
               >
                  Show total
               </Form.Toggle>

               <Spacer size="16px" />
               <Form.Toggle
                  id="subscriptionItemCountPerServing"
                  name="subscriptionItemCountPerServing"
                  value={form.subscriptionItemCountPerServing}
                  onChange={() =>
                     handleChange(
                        'subscriptionItemCountPerServing',
                        !form.subscriptionItemCountPerServing
                     )
                  }
               >
                  Show per serving
               </Form.Toggle>
            </Flex>
            <Spacer size="24px" />
            <Form.Group>
               <Form.Label htmlFor="label" title="label">
                  <Flex container alignItems="center">
                     Yield Information
                     <Tooltip identifier="brand_subscriptionYieldInformation_info" />
                  </Flex>
               </Form.Label>
               <Form.TextArea
                  id="subscriptionYieldInformation"
                  name="subscriptionYieldInformation"
                  value={form.subscriptionYieldInformation}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Form.Group>

            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
