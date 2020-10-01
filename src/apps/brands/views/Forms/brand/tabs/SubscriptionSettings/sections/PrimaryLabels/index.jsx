import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const PrimaryLabels = ({ update }) => {
   const [form, setForm] = React.useState({
      login: '',
      logout: '',
      signup: '',
      itemLabelPlural: '',
      itemLabelSingular: '',
      yieldLabelPlural: '',
      yieldLabelSingular: '',
   })
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.SUBSCRIPTION_SETTING, {
      variables: {
         identifier: { _eq: 'primary-labels' },
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
                  ...(brand.value?.login && {
                     login: brand.value.login,
                  }),
                  ...(brand.value?.logout && {
                     logout: brand.value.logout,
                  }),
                  ...(brand.value?.signup && {
                     signup: brand.value.signup,
                  }),
                  ...(brand.value?.itemLabel?.plural && {
                     itemLabelPlural: brand.value.itemLabel.plural,
                  }),
                  ...(brand.value?.itemLabel?.singular && {
                     itemLabelSingular: brand.value.itemLabel.singular,
                  }),
                  ...(brand.value?.yieldLabel?.plural && {
                     yieldLabelPlural: brand.value.yieldLabel.plural,
                  }),
                  ...(brand.value?.yieldLabel?.singular && {
                     yieldLabelSingular: brand.value.yieldLabel.singular,
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
            login: form.login,
            logout: form.logout,
            signup: form.signup,
            itemLabel: {
               plural: form.itemLabelPlural,
               singular: form.itemLabelSingular,
            },
            yieldLabel: {
               plural: form.yieldLabelPlural,
               singular: form.yieldLabelSingular,
            },
         },
      })
   }, [form, settingId, update])

   const handleChange = (name, value) => {
      setForm(form => ({ ...form, [name]: value }))
   }

   return (
      <div id="primary-labels">
         <Flex>
            <Flex container alignItems="center">
               <Input
                  type="text"
                  name="login"
                  label="Login Label"
                  value={form.login}
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  name="logout"
                  label="Logout Label"
                  value={form.logout}
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Input
               type="text"
               name="signup"
               value={form.signup}
               label="Sign Up Label"
               style={{ width: '240px' }}
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
            <Spacer size="24px" />
            <Text as="h3">Item Label</Text>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Input
                  type="text"
                  label="Plural Label"
                  name="itemLabelPlural"
                  value={form.itemLabelPlural}
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  label="Singular Label"
                  name="itemLabelSingular"
                  style={{ width: '240px' }}
                  value={form.itemLabelSingular}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Text as="h3">Yield Label</Text>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Input
                  type="text"
                  label="Plural Label"
                  name="yieldLabelPlural"
                  style={{ width: '240px' }}
                  value={form.yieldLabelPlural}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  label="Singular Label"
                  name="yieldLabelSingular"
                  style={{ width: '240px' }}
                  value={form.yieldLabelSingular}
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
