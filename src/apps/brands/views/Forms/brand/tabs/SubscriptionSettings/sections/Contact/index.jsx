import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

export const Contact = ({ update }) => {
   const params = useParams()
   const [form, setForm] = React.useState({
      email: '',
      phoneNo: '',
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'Contact' },
         type: { _eq: 'brand' },
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
                  ...(brand.value?.email && { email: brand.value.email }),
                  ...(brand.value?.phoneNo && { phoneNo: brand.value.phoneNo }),
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
            email: form.email,
            phoneNo: form.phoneNo,
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="Contact">
         <Flex>
            <Flex>
               <Flex container alignItems="flex-start">
                  <Text as="h3">Email</Text>
                  <Tooltip identifier="brand_contact_email_info" />
               </Flex>
               <Spacer size="4px" />
               <Form.Text
                  id="email"
                  name="email"
                  value={form.email}
                  placeholder="Enter email"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Flex container alignItems="flex-start">
                  <Text as="h3">Phone No.</Text>
                  <Tooltip identifier="brand_contact_phone_info" />
               </Flex>
               <Spacer size="4px" />
               <Form.Number
                  id="phoneNo"
                  name="phoneNo"
                  value={form.phoneNo}
                  placeholder="Enter phone no."
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
