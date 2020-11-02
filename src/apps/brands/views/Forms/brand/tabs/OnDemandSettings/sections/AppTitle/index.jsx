import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Form } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import {
   Flex,
   Tooltip,
   InlineLoader,
} from '../../../../../../../../../shared/components'
import { logger } from '../../../../../../../../../shared/utils'

export const AppTitle = ({ update }) => {
   const params = useParams()
   const [title, setTitle] = React.useState('')
   const [settingId, setSettingId] = React.useState(null)
   const { loading, error } = useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'App Title' },
         type: { _eq: 'visual' },
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
            if ('title' in brand.value) {
               setTitle(brand.value.title)
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      if (!settingId) return
      if (!title.trim()) return toast.error('Brand name must be provided')
      update({ id: settingId, value: { title } })
   }, [title, settingId])

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   return (
      <div id="App Title">
         <Flex container alignItems="flex-start">
            <Text as="h3">App Title</Text>
            <Tooltip identifier="app_title_info" />
         </Flex>
         <Spacer size="4px" />
         <Flex container alignItems="center">
            <Form.Text
               id="name"
               name="name"
               placeholder="Enter app title"
               value={title}
               onChange={e => setTitle(e.target.value)}
            />
            <Spacer size="8px" xAxis />
            <TextButton size="lg" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
