import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, Text, TextButton, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'

export const DeliveryDay = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      title: '',
      description: '',
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'delivery-day' },
         type: { _eq: 'Select-Delivery' },
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
                  ...(brand.value?.title && { title: brand.value.title }),
                  ...(brand.value?.description && {
                     description: brand.value.description,
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
            title: form.title,
            description: form.description,
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="delivery-day">
         <Text as="h3">Delivery Day Details</Text>
         <Spacer size="24px" />
         <Input
            type="text"
            name="title"
            label="Title"
            value={form.title}
            style={{ width: '240px' }}
            onChange={e => handleChange(e.target.name, e.target.value)}
         />
         <Spacer size="24px" />
         <Input
            rows="3"
            type="textarea"
            name="description"
            label="Description"
            value={form.description}
            onChange={e => handleChange(e.target.name, e.target.value)}
         />
         <Spacer size="16px" />
         <TextButton size="sm" type="outline" onClick={updateSetting}>
            Update
         </TextButton>
      </div>
   )
}
