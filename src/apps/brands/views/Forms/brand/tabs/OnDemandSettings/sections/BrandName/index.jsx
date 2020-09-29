import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const BrandName = ({ update }) => {
   const params = useParams()
   const [name, setName] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'Brand Name' },
         type: { _eq: 'brand' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(onDemandSetting)) {
            const { value, storeSettingId } = onDemandSetting[0]
            setName(value.name)
            setSettingId(storeSettingId)
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      if (!name.trim()) return toast.error('Brand name must be provided')
      update({ id: settingId, value: { name } })
   }, [name, settingId])

   return (
      <div id="Brand Name">
         <Text as="h3">Name</Text>
         <Spacer size="4px" />
         <Flex container alignItems="center">
            <Input
               type="text"
               label=""
               name="name"
               value={name}
               style={{ width: '240px' }}
               placeholder="Enter brand name"
               onChange={e => setName(e.target.value)}
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
