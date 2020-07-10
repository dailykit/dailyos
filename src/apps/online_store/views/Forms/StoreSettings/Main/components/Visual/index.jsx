import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Input,
   TextButton,
   Loader,
   ButtonTile,
   IconButton,
} from '@dailykit/ui'
import { toast } from 'react-toastify'

import { EditIcon } from '../../../../../../assets/icons'

import { Container, Flex } from '../../../styled'
import { ImageContainer } from '../../styled'
import { UPDATE_STORE_SETTING, STORE_SETTINGS } from '../../../../../../graphql'
import { DeleteIcon } from '../../../../../../../recipe/assets/icons'

const VisualSettings = ({ setUpdating, openTunnel }) => {
   const [title, setTitle] = React.useState('')
   const [primaryColor, setPrimaryColor] = React.useState('')
   const [favicon, setFavicon] = React.useState('')
   const [slides, setSlides] = React.useState([])

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
            case 'Slides': {
               return setSlides(setting.value)
            }
            default: {
               return console.log('No setting matched!')
            }
         }
      })
   }

   // Query
   const { loading } = useSubscription(STORE_SETTINGS, {
      variables: {
         type: 'visual',
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
            type: 'visual',
            identifier,
            value,
         },
      })
   }

   const deleteSlide = index => {
      if (slides.length === 1) {
         toast.error('Atleast one slide should be there!')
      } else {
         slides.splice(index, 1)
         updateSetting({
            variables: {
               type: 'visual',
               identifier: 'Slides',
               value: slides,
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <Container bottom="80" id="visual">
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
                  onClick={() =>
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
               <>
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
               </>
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
         {slides.map((slide, i) => (
            <Container bottom="16" maxWidth="600">
               <Text as="subtitle">{`Slide ${i + 1}`}</Text>
               <ImageContainer width="600px" height="250px">
                  <div>
                     <IconButton type="ghost" onClick={() => deleteSlide(i)}>
                        <DeleteIcon color="#FF5A52" />
                     </IconButton>
                  </div>
                  <img src={slide.url} alt={slide.title} />
               </ImageContainer>
            </Container>
         ))}
         <Container bottom="32" maxWidth="600">
            <ButtonTile
               type="secondary"
               text="Add Slide"
               onClick={() => {
                  setUpdating({
                     type: 'visual',
                     identifier: 'Slides',
                     oldValue: slides,
                  })
                  openTunnel(1)
               }}
            />
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
                  onClick={() =>
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
