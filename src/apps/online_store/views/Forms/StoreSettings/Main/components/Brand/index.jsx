import React from 'react'
import { Text, Input, TextButton, Loader, ButtonTile } from '@dailykit/ui'

import { EditIcon } from '../../../../../../assets/icons'

import { Container, Flex } from '../../../styled'
import { ImageContainer } from '../../styled'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { UPDATE_STORE_SETTING, STORE_SETTINGS } from '../../../../../../graphql'
import { toast } from 'react-toastify'

const BrandSettings = () => {
   const [name, setName] = React.useState('')
   const [logo, setLogo] = React.useState('')

   const populate = settings => {
      settings.forEach(setting => {
         switch (setting.identifier) {
            case 'Brand Name': {
               return setName(setting.value.name)
            }
            case 'Brand Logo': {
               return setLogo(setting.value.url)
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
         type: 'brand',
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
            type: 'brand',
            identifier,
            value,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <Container bottom="80">
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
                  onClick={e =>
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
               <React.Fragment>
                  <Text as="subtitle">Logo</Text>
                  <ImageContainer width="300px" height="300px">
                     <div>
                        <span onClick={() => console.log('Photo')}>
                           <EditIcon />
                        </span>
                     </div>
                     <img src={logo} alt="Brand Logo" />
                  </ImageContainer>
               </React.Fragment>
            ) : (
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add a Logo"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => console.log('Photo')}
               />
            )}
         </Container>
      </Container>
   )
}

export default BrandSettings
