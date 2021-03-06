import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Spacer, Toggle } from '@dailykit/ui'
import validator from '../../../../../../validator'
import { BRANDS } from '../../../../../../../graphql'
import {
   Flex,
   Tooltip,
   InlineLoader,
} from '../../../../../../../../../shared/components'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../../shared/utils'

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
   const { loading, error } = useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
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
               setForm({
                  selectButtonLabel: brand.value?.selectButtonLabel || '',
                  subscriptionYieldInformation:
                     brand.value?.subscriptionYield?.information || '',
                  subscriptionTitleThumbnail:
                     brand.value?.subscriptionTitle?.thumbnail,
                  subscriptionTitleDescription:
                     brand.value?.subscriptionTitle?.description,
                  subscriptionItemCountTotal:
                     brand.value?.subscriptionItemCount?.total,
                  subscriptionItemCountPerServing:
                     brand.value?.subscriptionItemCount?.perServing,
               })
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      update({
         id: settingId,
         value: {
            ...(form.selectButtonLabel.trim() && {
               selectButtonLabel: form.selectButtonLabel,
            }),
            subscriptionTitle: {
               thumbnail: form.subscriptionTitleThumbnail,
               description: form.subscriptionTitleDescription,
            },
            ...(form.subscriptionYieldInformation.trim() && {
               subscriptionYield: {
                  information: form.subscriptionYieldInformation,
               },
            }),
            subscriptionItemCount: {
               total: form.subscriptionItemCountTotal,
               perServing: form.subscriptionItemCountPerServing,
            },
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm({
         ...form,
         [name]: value,
      })
   }

   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }
   if (loading) return <InlineLoader />

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
                  <Flex container alignItems="center">
                     Show plan description
                     <Tooltip identifier="brand_subscription_TitleDescription_info" />
                  </Flex>
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
                  <Flex container alignItems="center">
                     Show plan thumbnail
                     <Tooltip identifier="brand_subscription_TitleThumbnail_info" />
                  </Flex>
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
                  <Flex container alignItems="center">
                     Show total
                     <Tooltip identifier="brand_subscription_ItemCountTotal_info" />
                  </Flex>
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
                  <Flex container alignItems="center">
                     Show per serving
                     <Tooltip identifier="brand_subscription_itemCount_PerServing_info" />
                  </Flex>
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
