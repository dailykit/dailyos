import React from 'react'
import {
   Text,
   Input,
   TextButton,
   Loader,
   ButtonTile,
   useTunnel,
   Tunnels,
   Tunnel,
} from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { EditIcon } from '../../../../../../assets/icons'

import { Container, Flex } from '../../../styled'
import { ImageContainer } from '../../styled'
import { UPDATE_STORE_SETTING, STORE_SETTINGS } from '../../../../../../graphql'
import { AddressTunnel } from '../../tunnels'

const BrandSettings = ({ setUpdating, openTunnel }) => {
   const [name, setName] = React.useState('')
   const [logo, setLogo] = React.useState('')
   const [address, setAddress] = React.useState({})

   const [addressTunnel, openAddressTunnel, closeAddressTunnel] = useTunnel(1)

   const populate = settings => {
      settings.forEach(setting => {
         switch (setting.identifier) {
            case 'Brand Name': {
               return setName(setting.value.name)
            }
            case 'Brand Logo': {
               return setLogo(setting.value.url)
            }
            case 'Address': {
               return setAddress(setting.value)
            }
            default: {
               return toast.error('Settings mismatch!')
            }
         }
      })
   }

   // Query
   const { loading } = useSubscription(STORE_SETTINGS, {
      variables: {
         type: 'brand',
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
            type: 'brand',
            identifier,
            value,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={addressTunnel}>
            <Tunnel layer={1}>
               <AddressTunnel
                  closeTunnel={closeAddressTunnel}
                  address={address}
               />
            </Tunnel>
         </Tunnels>
         <Container bottom="80" id="brand">
            <Text as="h2">Brand</Text>
            <Container top="32" bottom="32" maxWidth="600">
               <Flex direction="row">
                  <Input
                     style={{ width: '350px' }}
                     type="text"
                     label="Name"
                     name="name"
                     value={name}
                     onChange={e => setName(e.target.value)}
                  />
                  <TextButton
                     type="solid"
                     onClick={() =>
                        save({
                           identifier: 'Brand Name',
                           value: { name },
                        })
                     }
                  >
                     Update
                  </TextButton>
               </Flex>
            </Container>
            <Container bottom="32" maxWidth="600">
               {logo ? (
                  <>
                     <Text as="subtitle">Logo</Text>
                     <ImageContainer width="300px" height="300px">
                        <div>
                           <span
                              role="button"
                              tabIndex="0"
                              onKeyDown={e =>
                                 e.charCode === 13 &&
                                 setUpdating({
                                    type: 'brand',
                                    identifier: 'Brand Logo',
                                 })
                              }
                              onClick={() => {
                                 setUpdating({
                                    type: 'brand',
                                    identifier: 'Brand Logo',
                                 })
                                 openTunnel(1)
                              }}
                           >
                              <EditIcon />
                           </span>
                        </div>
                        <img src={logo} alt="Brand Logo" />
                     </ImageContainer>
                  </>
               ) : (
                  <ButtonTile
                     type="primary"
                     size="sm"
                     text="Add a Logo"
                     helper="upto 1MB - only JPG, PNG, PDF allowed"
                     onClick={() => {
                        setUpdating({
                           type: 'brand',
                           identifier: 'Brand Logo',
                        })
                        openTunnel(1)
                     }}
                  />
               )}
            </Container>
            <Container bottom="32" maxWidth="600">
               {Object.keys(address).length ? (
                  <>
                     <Flex
                        direction="row"
                        align="center"
                        justify="space-between"
                     >
                        <div>
                           <Text as="subtitle">Address</Text>
                           <Text as="p">{address.line1}</Text>
                           <Text as="p">{address.line2}</Text>
                           <Text as="p">{`${address.city}, ${address.state}, ${address.country}`}</Text>
                           <Text as="p">{address.zipcode}</Text>
                        </div>
                        <TextButton
                           type="solid"
                           onClick={() => openAddressTunnel(1)}
                        >
                           Update
                        </TextButton>
                     </Flex>
                  </>
               ) : (
                  <ButtonTile
                     noIcon
                     type="secondary"
                     text="Add Address"
                     onClick={() => openAddressTunnel(1)}
                  />
               )}
            </Container>
         </Container>
      </>
   )
}

export default BrandSettings
