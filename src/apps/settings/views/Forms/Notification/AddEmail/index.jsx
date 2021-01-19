import React from 'react'
import { Form, Spacer, Text,TunnelHeader,Flex,ButtonTile } from '@dailykit/ui'
import { initialState, reducers } from './store'
import { logger } from '../../../../../../shared/utils'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { NOTIFICATIONS } from '../../../../graphql'
import { useParams } from 'react-router-dom'
import validate from '../../User/validator'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../shared/components'

const AddEmailAdresses = () => {
   const params = useParams()
   const [emails, setEmails] = React.useState([])
   const {
      loading,
      error,
      data: { notificationTypes = [] } = {},
   } = useSubscription(NOTIFICATIONS.LIST,{
variables:{id:params.id}
   })

   if (error) {
      logger(error)
   }

   const [createEmailConfigs, { loading: creatingEmailConfigs }] = useMutation(
      NOTIFICATIONS.CREATE_EMAIL_CONFIGS,
      {
         onCompleted: () => {
            toast.success('Emails added')
         
         },
         onError: error => {
            toast.error('Failed to add Email')
            logger(error)
         },
      }
   )

   const onChange = (e, i) => {
      const createdEmails = emails
      const value = e.target.value.trim()
      createdEmails[i] = value
      setEmails([...createdEmails])
   }

   const add = () =>
   {
      try {
         const objects = emails.filter(Boolean).map(email =>
         (
            {
               email: email,
               typeId:notificationTypes.id
            }
            ))
         if (!objects.length)
         {
            throw Error('Nothing to add')
         }
         createEmailConfigs(
            {
               variables:objects
            }
         )
      
      }
      catch (error)
      {
         toast.error(error.message)
      }
      }


   return (
      <>
      
    <TunnelHeader
            title="Add New Emails"
            right={{
               action: add,
               title: 'Add Email',
               isLoading: creatingEmailConfigs,

            }}

      /> 
         <Flex padding="16px">
            {emails.map((email, i) => (
               <>
                  <Form.Group>
                     <Form.Label htmlFor={`email-${i}`} title={`email-${i}`}>
                        Enter Email*
                     </Form.Label>
                     <Form.Text
                        value={email}
                        id={`email-${i}`}
                        name={`email-${i}`}
                        onChange={e => onChange(e, i)}
                        placeholder="Enter the Email"
                     />
                  </Form.Group>
                  <Spacer size="16px" />
               </>
            ))}
            <ButtonTile
               type="secondary"
               text="Add New Email"
               onClick={() => setEmails([...emails, ''])}
            />
         </Flex>
      </>

      
   )
}

export default AddEmailAdresses;