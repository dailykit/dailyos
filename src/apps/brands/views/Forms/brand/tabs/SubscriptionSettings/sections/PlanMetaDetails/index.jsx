import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer, Toggle } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

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
            <Input
               type="text"
               name="selectButtonLabel"
               label="Select Button Label"
               style={{ width: '240px' }}
               value={form.selectButtonLabel}
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Plan Title</Text>
               <Spacer size="16px" />
               <Toggle
                  label="Show plan description"
                  checked={form.subscriptionTitleDescription}
                  setChecked={value =>
                     handleChange('subscriptionTitleDescription', value)
                  }
               />
               <Spacer size="16px" />
               <Toggle
                  label="Show plan thumbnail"
                  checked={form.subscriptionTitleThumbnail}
                  setChecked={value =>
                     handleChange('subscriptionTitleThumbnail', value)
                  }
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Plan Item Counts</Text>
               <Spacer size="16px" />
               <Toggle
                  label="Show total"
                  checked={form.subscriptionItemCountTotal}
                  setChecked={value =>
                     handleChange('subscriptionItemCountTotal', value)
                  }
               />
               <Spacer size="16px" />
               <Toggle
                  label="Show per serving"
                  checked={form.subscriptionItemCountPerServing}
                  setChecked={value =>
                     handleChange('subscriptionItemCountPerServing', value)
                  }
               />
            </Flex>
            <Spacer size="24px" />
            <Input
               rows="3"
               type="textarea"
               label="Yield Information"
               name="subscriptionYieldInformation"
               value={form.subscriptionYieldInformation}
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
