import React from 'react'
import { isEmpty, isNull } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

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
               <Input
                  type="text"
                  name="checkout"
                  label="Checkout Label"
                  value={form.checkout}
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  name="register"
                  label="Register Label"
                  value={form.register}
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Flex>
            <Spacer size="24px" />
            <Flex container alignItems="center">
               <Input
                  type="text"
                  name="selectMenu"
                  value={form.selectMenu}
                  label="Select Menu Label"
                  style={{ width: '240px' }}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
               <Spacer size="16px" xAxis />
               <Input
                  type="text"
                  name="selectDelivery"
                  value={form.selectDelivery}
                  style={{ width: '240px' }}
                  label="Select Delivery Label"
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
