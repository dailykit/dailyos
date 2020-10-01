import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle, Input } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex } from '../../../../../../../../../shared/components'

export const Store = ({ update }) => {
   const params = useParams()
   const [settingId, setSettingId] = React.useState(null)
   const [isOpen, setIsOpen] = React.useState(false)
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [message, setMessage] = React.useState('')
   useSubscription(BRANDS.ONDEMAND_SETTING, {
      variables: {
         identifier: { _eq: 'Store Availability' },
         type: { _eq: 'availability' },
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
            if ('isOpen' in brand.value) {
               setIsOpen(brand.value.isOpen)
            }
            if ('shutMessage' in brand.value) {
               setMessage(brand.value.shutMessage)
            }
            if ('from' in brand.value) {
               setFrom(brand.value.from)
            }
            if ('to' in brand.value) {
               setTo(brand.value.to)
            }
         }
      },
   })

   const updateSetting = React.useCallback(() => {
      update({
         id: settingId,
         value: {
            isOpen,
            from,
            to,
            shutMessage: message,
         },
      })
   }, [isOpen, from, to, message, settingId])

   return (
      <div id="Store Availability">
         <Text as="h3">Store Availability</Text>
         <Spacer size="8px" />
         <Flex container alignItems="start" justifyContent="space-between">
            <Flex>
               <Toggle label="Open" checked={isOpen} setChecked={setIsOpen} />
               <Spacer size="16px" />
               <Flex container alignItems="center">
                  <Flex>
                     <Text as="p">From</Text>
                     <input
                        type="time"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                     />
                  </Flex>
                  <Spacer size="24px" xAxis />
                  <Flex>
                     <Text as="p">To</Text>
                     <input
                        type="time"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                     />
                  </Flex>
               </Flex>
               <Spacer size="16px" />
               <section>
                  <Text as="p">Text to show when store's closed</Text>
                  <Input
                     type="text"
                     value={message}
                     name="shut-message"
                     onChange={e => setMessage(e.target.value)}
                     placeholder="Enter the closed store message"
                  />
               </section>
            </Flex>
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
