import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Contact = ({ update }) => {
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
            const { id, brand } = subscriptionSetting[0]
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
               <Text as="h3">Email</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="email"
                  value={form.email}
                  style={{ width: '240px' }}
                  placeholder="Enter email"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Phone No.</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="phoneNo"
                  value={form.phoneNo}
                  style={{ width: '240px' }}
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
