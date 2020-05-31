import React from 'react'
import { Text, Input, TextButton, Loader } from '@dailykit/ui'

import { Container, Flex } from '../../../styled'
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
   const save = ({ type, identifier, value }) => {
      updateSetting({
         variables: {
            type,
            identifier,
            value,
         },
      })
   }

   if (loading) return <Loader />

   return (
      <React.Fragment>
         <Text as="h2">Brand</Text>
         <Container top="32" bottom="32" width="500">
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
                        type: 'brand',
                        identifier: 'Brand Name',
                        value: { name },
                     })
                  }
               >
                  Save
               </TextButton>
            </Flex>
         </Container>
      </React.Fragment>
   )
}

export default BrandSettings
