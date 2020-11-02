import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, Text, TextButton, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

export const FirstDelivery = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      title: '',
      description: '',
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'first-delivery' },
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
      <div id="first-delivery">
         <Flex container alignItems="center">
            <Text as="h3">First Delivery Date Details</Text>
            <Tooltip identifier="brand_first_delivery_info" />
         </Flex>
         <Spacer size="24px" />
         <Form.Group>
            <Form.Label htmlFor="title" title="title">
               <Flex container alignItems="center">
                  Title
                  <Tooltip identifier="brand_first_delivery_title_info" />
               </Flex>
            </Form.Label>
            <Form.Text
               id="title"
               name="title"
               value={form.title}
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
         </Form.Group>
         <Spacer size="24px" />
         <Form.Group>
            <Form.Label htmlFor="title" title="title">
               <Flex container alignItems="center">
                  Description
                  <Tooltip identifier="brand_first_delivery_description_info" />
               </Flex>
            </Form.Label>
            <Form.TextArea
               id="description"
               name="description"
               value={form.description}
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
         </Form.Group>

         <Spacer size="16px" />
         <TextButton size="sm" type="outline" onClick={updateSetting}>
            Update
         </TextButton>
      </div>
   )
}
