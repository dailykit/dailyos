import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer, Form } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import {
   Flex,
   Tooltip,
   InlineLoader,
} from '../../../../../../../../../shared/components'
import { logger } from '../../../../../../../../../shared/utils'

export const BrandName = ({ update }) => {
   const params = useParams()
   const [name, setName] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   const { loading, error } = useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Brand Name' },
         type: { _eq: 'brand' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { storeSettings = [] } = {} } = {},
      }) => {
         if (!isEmpty(storeSettings)) {
            const index = storeSettings.findIndex(
               node => node?.brand?.brandId === Number(params.id)
            )

            if (index === -1) {
               const { id } = storeSettings[0]
               setSettingId(id)
               return
            }
            const { brand, id } = storeSettings[index]
            setSettingId(id)
            if ('name' in brand.value) {
               setName(brand.value.name)
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      if (!name.trim()) return toast.error('Brand name must be provided')
      update({ id: settingId, value: { name } })
   }, [name, settingId])

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   return (
      <div id="Brand Name">
         <Flex container alignItems="flex-start">
            <Text as="h3">Name</Text>
            <Tooltip identifier="brand_name_info" />
         </Flex>
         <Spacer size="4px" />
         <Flex container alignItems="center">
            <Form.Text
               id="name"
               name="name"
               value={name}
               placeholder="Enter brand name"
               onChange={e => setName(e.target.value)}
            />
            <Spacer size="8px" xAxis />
            <TextButton size="lg" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
