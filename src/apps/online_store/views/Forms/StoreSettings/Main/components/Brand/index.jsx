import React from 'react'
import { Text, Input, TextButton } from '@dailykit/ui'

import { Container, Flex } from '../../../styled'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_STORE_SETTING } from '../../../../../../graphql'
import { toast } from 'react-toastify'

const BrandSettings = () => {
   const [name, setName] = React.useState('')

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

   const save = ({ type, identifier, value }) => {
      updateSetting({
         variables: {
            type,
            identifier,
            value,
         },
      })
   }

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
