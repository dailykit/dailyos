import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const StepsLabel = ({ update }) => {
   const [form, setForm] = React.useState({
      checkout: '',
      register: '',
      selectMenu: '',
      selectDelivery: '',
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'steps-labels' },
         type: { _eq: 'conventions' },
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
                  ...(brand.value?.checkout && {
                     checkout: brand.value.checkout,
                  }),
                  ...(brand.value?.register && {
                     register: brand.value.register,
                  }),
                  ...(brand.value?.selectMenu && {
                     selectMenu: brand.value.selectMenu,
                  }),
                  ...(brand.value?.selectDelivery && {
                     selectDelivery: brand.value.selectDelivery,
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
            checkout: form.checkout,
            register: form.register,
            selectMenu: form.selectMenu,
            selectDelivery: form.selectDelivery,
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="steps-label">
         <Flex>
            <Flex>
               <Text as="h3">Checkout Label</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="checkout"
                  value={form.checkout}
                  style={{ width: '240px' }}
                  placeholder="Enter checkout label"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Register Label</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="register"
                  value={form.register}
                  style={{ width: '240px' }}
                  placeholder="Enter register label"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Select Menu Label</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="selectMenu"
                  value={form.selectMenu}
                  style={{ width: '240px' }}
                  placeholder="Enter select menu label"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex>
               <Text as="h3">Select Delivery Label</Text>
               <Spacer size="4px" />
               <Input
                  label=""
                  type="text"
                  name="selectDelivery"
                  value={form.selectDelivery}
                  style={{ width: '240px' }}
                  placeholder="Enter select delivery label"
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
