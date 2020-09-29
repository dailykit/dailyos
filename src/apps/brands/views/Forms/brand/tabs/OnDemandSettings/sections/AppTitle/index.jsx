import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Input, TextButton, Text, Spacer } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const AppTitle = ({ update }) => {
   const params = useParams()
   const [title, setTitle] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         brandId: { _eq: params.id },
         identifier: { _eq: 'App Title' },
         type: { _eq: 'visual' },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { onDemandSetting = [] } = {} } = {},
      }) => {
         if (!isEmpty(onDemandSetting)) {
            const { value, storeSettingId } = onDemandSetting[0]
            setTitle(value.title)
            setSettingId(storeSettingId)
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      if (!title.trim()) return toast.error('Brand name must be provided')
      update({ id: settingId, value: { title } })
   }, [title, settingId])

   return (
      <div id="App Title">
         <Text as="h3">App Title</Text>
         <Spacer size="4px" />
         <Flex container alignItems="center">
            <Input
               type="text"
               label=""
               name="name"
               value={title}
               style={{ width: '240px' }}
               placeholder="Enter app title"
               onChange={e => setTitle(e.target.value)}
            />
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}