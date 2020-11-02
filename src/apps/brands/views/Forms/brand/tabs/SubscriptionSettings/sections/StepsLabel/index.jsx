import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Form, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

export const StepsLabel = ({ update }) => {
   const params = useParams()
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
      <div id="steps-labels">
         <Flex>
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Checkout Label
                        <Tooltip identifier="brand_checkout_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="checkout"
                     name="checkout"
                     value={form.checkout}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Register Label
                        <Tooltip identifier="brand_register_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="register"
                     name="register"
                     value={form.register}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="24px" />
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Select Menu Label
                        <Tooltip identifier="brand_selectMenu_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="selectMenu"
                     name="selectMenu"
                     value={form.selectMenu}
                     onChange={e => handleChange(e.target.name, e.target.value)}
                  />
               </Form.Group>

               <Spacer size="16px" xAxis />
               <Form.Group>
                  <Form.Label htmlFor="label" title="label">
                     <Flex container alignItems="center">
                        Select Delivery Label
                        <Tooltip identifier="brand_delivery_label_info" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="selectDelivery"
                     name="selectDelivery"
                     value={form.selectDelivery}
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
