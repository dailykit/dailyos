import React from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { TextButton, Text, Spacer, Toggle, Input, Form } from '@dailykit/ui'

import { BRANDS } from '../../../../../../../graphql'
import { Flex, Tooltip } from '../../../../../../../../../shared/components'

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
         <Flex container alignItems="flex-start">
            <Text as="h3">Store Availability</Text>
            <Tooltip identifier="brand_store_availability_info" />
         </Flex>
         <Spacer size="8px" />
         <Flex container alignItems="start" justifyContent="space-between">
            <Flex>
               <Form.Toggle
                  name="open"
                  value={isOpen}
                  onChange={() => setIsOpen(!isOpen)}
               >
                  <Flex container alignItems="center">
                     Open
                     <Tooltip identifier="brand_store_open_info" />
                  </Flex>
               </Form.Toggle>
               <Spacer size="16px" />
               <Flex container alignItems="center">
                  <Flex>
                     <Form.Group>
                        <Form.Label htmlFor="time" title="time">
                           <Flex container alignItems="center">
                              From
                              <Tooltip identifier="brand_store_open_from_info" />
                           </Flex>
                        </Form.Label>
                        <Form.Time
                           id="fromTime"
                           name="fromTime"
                           onChange={e => setFrom(e.target.value)}
                           value={from}
                        />
                     </Form.Group>
                  </Flex>
                  <Spacer size="24px" xAxis />
                  <Flex>
                     <Form.Group>
                        <Form.Label htmlFor="time" title="time">
                           <Flex container alignItems="center">
                              To
                              <Tooltip identifier="brand_store_open_to_info" />
                           </Flex>
                        </Form.Label>
                        <Form.Time
                           id="toTime"
                           name="toTime"
                           value={to}
                           onChange={e => setTo(e.target.value)}
                        />
                     </Form.Group>
                  </Flex>
               </Flex>
               <Spacer size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="time" title="time">
                     Text to show when store's closed
                  </Form.Label>
                  <Form.Text
                     value={message}
                     name="shut-message"
                     onChange={e => setMessage(e.target.value)}
                     placeholder="Enter the closed store message"
                  />
               </Form.Group>
            </Flex>
            <TextButton size="sm" type="outline" onClick={updateSetting}>
               Update
            </TextButton>
         </Flex>
      </div>
   )
}
