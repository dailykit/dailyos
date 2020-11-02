import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

export const PrimaryLabels = ({ update }) => {
   const params = useParams()
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
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Login Label
                        <Tooltip identifier="brand_login_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="login"
                     name="login"
                     value={form.login}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>

               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Logout Label
                        <Tooltip identifier="brand_logout_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="logout"
                     name="logout"
                     value={form.logout}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="24px" />
            <Form.Group>
               <Form.Label htmlFor="label" title="label">
                  <Flex container alignItems="center">
                     Sign Up Label
                     <Tooltip identifier="brand_signup_label_info" />
                  </Flex>
               </Form.Label>
               <Form.Text
                  id="signup"
                  name="signup"
                  value={form.signup}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Form.Group>

            <Spacer size="24px" />
            <Flex container alignItems="center">
               <Text as="h3">Item Label</Text>
               <Tooltip identifier="brand_item_label_info" />
            </Flex>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Plural Label
                        <Tooltip identifier="brand_itemLabelPlural_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="itemLabelPlural"
                     name="itemLabelPlural"
                     value={form.itemLabelPlural}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>

               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Singular Label
                        <Tooltip identifier="brand_itemLabelSingular_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="itemLabelSingular"
                     name="itemLabelSingular"
                     value={form.itemLabelSingular}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="24px" />
            <Flex container alignItems="center">
               <Text as="h3">Yield Label</Text>
               <Tooltip identifier="brand_yield_label_info" />
            </Flex>
            <Spacer size="16px" />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Plural Label
                        <Tooltip identifier="brand_yieldLabelPlural_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="yieldLabelPlural"
                     name="yieldLabelPlural"
                     value={form.yieldLabelPlural}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Singular Label
                        <Tooltip identifier="brand_yieldLabelSingular_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="yieldLabelSingular"
                     name="yieldLabelSingular"
                     value={form.yieldLabelSingular}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="16px" />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
