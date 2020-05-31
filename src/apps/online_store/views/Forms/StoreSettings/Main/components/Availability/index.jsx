import React from 'react'
import { Text, Input, TextButton, Loader, Checkbox } from '@dailykit/ui'

import { Container, Flex, Grid } from '../../../styled'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { UPDATE_STORE_SETTING, STORE_SETTINGS } from '../../../../../../graphql'
import { toast } from 'react-toastify'

const AvailabilitySettings = () => {
   const [store, setStore] = React.useState(undefined)
   const [pickup, setPickup] = React.useState(undefined)
   const [delivery, setDelivery] = React.useState(undefined)

   const populate = settings => {
      settings.forEach(setting => {
         switch (setting.identifier) {
            case 'Store Availability': {
               return setStore(setting.value)
            }
            case 'Pickup Availability': {
               return setPickup(setting.value)
            }
            case 'Delivery Availability': {
               return setDelivery(setting.value)
            }
            default: {
               return
            }
         }
      })
   }

   // Query
   const { loading } = useSubscription(STORE_SETTINGS, {
      variables: {
         type: 'availability',
      },
      onSubscriptionData: data =>
         populate(data.subscriptionData.data.storeSettings),
   })

   // Mutation
   const [updateSetting] = useMutation(UPDATE_STORE_SETTING, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   // Handlers
   const save = ({ identifier, value }) => {
      updateSetting({
         variables: {
            type: 'availability',
            identifier,
            value,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <Container bottom="80" id="availability">
         <Text as="h2">Availability</Text>
         <Container top="32" bottom="32" maxWidth="600">
            <Text as="p">Store</Text>
            <Flex direction="row" align="center">
               <Container>
                  <Container top="16" bottom="8">
                     <Checkbox
                        checked={store?.isOpen}
                        onChange={val => setStore({ ...store, isOpen: val })}
                     >
                        Open
                     </Checkbox>
                  </Container>
                  <Container bottom="16">
                     <Flex justify="start" direction="row">
                        <Container>
                           <Text as="subtitle">From</Text>
                           <input
                              style={{ marginRight: '32px' }}
                              type="time"
                              value={store?.from}
                              onChange={e =>
                                 setStore({ ...store, from: e.target.value })
                              }
                           />
                        </Container>
                        <Container>
                           <Text as="subtitle">To</Text>
                           <input
                              type="time"
                              value={store?.to}
                              onChange={e =>
                                 setStore({ ...store, to: e.target.value })
                              }
                           />
                        </Container>
                     </Flex>
                  </Container>
                  <Container bottom="16">
                     <Input
                        style={{ width: '400px' }}
                        type="text"
                        label="Message to display when store is closed"
                        name="shut-message"
                        value={store?.shutMessage || ''}
                        onChange={e =>
                           setStore({ ...store, shutMessage: e.target.value })
                        }
                     />
                  </Container>
               </Container>
               <TextButton
                  type="solid"
                  onClick={e =>
                     save({
                        identifier: 'Store Availability',
                        value: { ...store },
                     })
                  }
               >
                  Update
               </TextButton>
            </Flex>
         </Container>
         <Container top="32" bottom="32" maxWidth="600">
            <Text as="p">Pickup</Text>
            <Flex direction="row" align="center">
               <Container>
                  <Container top="16" bottom="8">
                     <Checkbox
                        checked={pickup?.isAvailable}
                        onChange={val =>
                           setPickup({ ...pickup, isAvailable: val })
                        }
                     >
                        Available
                     </Checkbox>
                  </Container>
                  <Container bottom="16">
                     <Flex justify="start" direction="row">
                        <Container>
                           <Text as="subtitle">From</Text>
                           <input
                              style={{ marginRight: '32px' }}
                              type="time"
                              value={pickup?.from}
                              onChange={e =>
                                 setPickup({ ...pickup, from: e.target.value })
                              }
                           />
                        </Container>
                        <Container>
                           <Text as="subtitle">To</Text>
                           <input
                              type="time"
                              value={pickup?.to}
                              onChange={e =>
                                 setPickup({ ...pickup, to: e.target.value })
                              }
                           />
                        </Container>
                     </Flex>
                  </Container>
               </Container>
               <TextButton
                  type="solid"
                  onClick={e =>
                     save({
                        identifier: 'Pickup Availability',
                        value: { ...pickup },
                     })
                  }
               >
                  Update
               </TextButton>
            </Flex>
         </Container>
         <Container top="32" bottom="32" maxWidth="600">
            <Text as="p">Delivery</Text>
            <Flex direction="row" align="center">
               <Container>
                  <Container top="16" bottom="8">
                     <Checkbox
                        checked={delivery?.isAvailable}
                        onChange={val =>
                           setDelivery({ ...delivery, isAvailable: val })
                        }
                     >
                        Available
                     </Checkbox>
                  </Container>
                  <Container bottom="16">
                     <Flex justify="start" direction="row">
                        <Container>
                           <Text as="subtitle">From</Text>
                           <input
                              style={{ marginRight: '32px' }}
                              type="time"
                              value={delivery?.from}
                              onChange={e =>
                                 setDelivery({
                                    ...delivery,
                                    from: e.target.value,
                                 })
                              }
                           />
                        </Container>
                        <Container>
                           <Text as="subtitle">To</Text>
                           <input
                              type="time"
                              value={delivery?.to}
                              onChange={e =>
                                 setDelivery({
                                    ...delivery,
                                    to: e.target.value,
                                 })
                              }
                           />
                        </Container>
                     </Flex>
                  </Container>
               </Container>
               <TextButton
                  type="solid"
                  onClick={e =>
                     save({
                        identifier: 'Delivery Availability',
                        value: { ...delivery },
                     })
                  }
               >
                  Update
               </TextButton>
            </Flex>
         </Container>
      </Container>
   )
}

export default AvailabilitySettings
