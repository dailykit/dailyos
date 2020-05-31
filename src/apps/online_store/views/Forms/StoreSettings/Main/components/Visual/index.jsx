import React from 'react'
import { Text, Input, TextButton, Loader, ButtonTile } from '@dailykit/ui'

import { EditIcon } from '../../../../../../assets/icons'

import { Container, Flex } from '../../../styled'
import { ImageContainer } from '../../styled'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { UPDATE_STORE_SETTING, STORE_SETTINGS } from '../../../../../../graphql'
import { toast } from 'react-toastify'

const VisualSettings = ({ setUpdating, openTunnel }) => {
   const [title, setTitle] = React.useState('')
   const [primaryColor, setPrimaryColor] = React.useState('')
   const [favicon, setFavicon] = React.useState('')
   const [cover, setCover] = React.useState('')

   const populate = settings => {
      settings.forEach(setting => {
         switch (setting.identifier) {
            case 'App Title': {
               return setTitle(setting.value.title)
            }
            case 'Primary Color': {
               return setPrimaryColor(setting.value.color)
            }
            case 'Favicon': {
               return setFavicon(setting.value.url)
            }
            case 'Cover': {
               return setCover(setting.value.url)
            }
            default: {
               return
            }
         }
      })
   }

   // Query
   const { loading } = useQuery(STORE_SETTINGS, {
      variables: {
         type: 'visual',
      },
      onCompleted: data => populate(data.storeSettings),
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
      fetchPolicy: 'cache-and-network',
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
            type: 'visual',
            identifier,
            value,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <Container bottom="80">
         <Text as="h2">Visual</Text>
         <Container top="32" bottom="32" maxWidth="600">
            <Flex direction="row">
               <Input
                  style={{ width: '350px' }}
                  type="text"
                  label="App Title"
                  name="app-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
               />
               <TextButton
                  type="solid"
                  onClick={e =>
                     save({
                        identifier: 'App Title',
                        value: { title },
                     })
                  }
               >
                  Update
               </TextButton>
            </Flex>
         </Container>
         <Container bottom="32" maxWidth="600">
            {favicon ? (
               <React.Fragment>
                  <Text as="subtitle">Favicon</Text>
                  <ImageContainer width="80px" height="80px">
                     <div>
                        <span
                           onClick={() => {
                              setUpdating({
                                 type: 'visual',
                                 identifier: 'Favicon',
                              })
                              openTunnel(1)
                           }}
                        >
                           <EditIcon />
                        </span>
                     </div>
                     <img src={favicon} alt="Favicon" />
                  </ImageContainer>
               </React.Fragment>
            ) : (
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add a Favicon"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => {
                     setUpdating({
                        type: 'visual',
                        identifier: 'Favicon',
                     })
                     openTunnel(1)
                  }}
               />
            )}
         </Container>
         <Container bottom="32" maxWidth="600">
            {cover ? (
               <React.Fragment>
                  <Text as="subtitle">Cover</Text>
                  <ImageContainer width="600px" height="250px">
                     <div>
                        <span
                           onClick={() => {
                              setUpdating({
                                 type: 'visual',
                                 identifier: 'Cover',
                              })
                              openTunnel(1)
                           }}
                        >
                           <EditIcon />
                        </span>
                     </div>
                     <img src={cover} alt="Cover" />
                  </ImageContainer>
               </React.Fragment>
            ) : (
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add a Cover"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => {
                     setUpdating({
                        type: 'visual',
                        identifier: 'Cover',
                     })
                     openTunnel(1)
                  }}
               />
            )}
         </Container>
         <Container bottom="32" maxWidth="600">
            <Flex direction="row">
               <Container width="300">
                  <Text as="subtitle">Primary Color</Text>
                  <input
                     type="color"
                     name="primary-color"
                     value={primaryColor}
                     onChange={e => setPrimaryColor(e.target.value)}
                  />
               </Container>
               <TextButton
                  type="solid"
                  onClick={e =>
                     save({
                        identifier: 'Primary Color',
                        value: { color: primaryColor },
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

export default VisualSettings
