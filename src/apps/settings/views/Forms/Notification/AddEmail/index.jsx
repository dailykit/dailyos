import React from 'react'
import { useParams } from 'react-router-dom'
import {
   Form,
   Spacer,
   Text,
   TunnelHeader,
   Flex,
   ButtonTile,
} from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { initialState, reducers } from './store'
import { NOTIFICATIONS } from '../../../../graphql'
import { logger } from '../../../../../../shared/utils'
import validate from '../../User/validator'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../shared/components'

const AddEmailAdresses = ({ typeid }) => {
   const [
      createNotificationEmailConfigs,
      { data, loading: loadingNotificationEmailConfigs },
   ] = useMutation(NOTIFICATIONS.CREATE_EMAIL_CONFIGS, {
      onCompleted: () => {
         toast.success('Email added.')
      
      },
      onError: error => {
         toast.error('Failed to add Email!')
         logger(error)
         console.log(error)
      },
   })

   const [emails, setEmails] = React.useState([{ email: null ,typeId:typeid }])

   const handleChange = (i, event) => {
      const values = [...emails]
      values[i].email = event.target.value
      setEmails(values)
      console.log(emails)
   }

   const handleAdd = () => {
      const values = [...emails]

      setEmails(values)

      values.push({ email: null, typeId:typeid })
   }

   const handleRemove = i => {
      const values = [...emails]
      values.splice(i, 1)
      setEmails(values)
   }

   const add = () => {
      let inputVariables = {
         objects:
         {
            typeid:emails.typeId
         }
}
      try {

         createNotificationEmailConfigs({
           emails
         })
      }
      catch (error) {
         toast.error(error.message)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Add Email Addresses"
            right={{
               action: add,
               title: 'Add',
               disabled: emails.filter(Boolean).length === 0,
            }}
         />

         <Flex padding="50px">
            {emails.map((emailField, idx) => {
               return (
                  <>
                     <Form.Group>
                        <div key={`${emailField}-${idx}`}>
                           <Form.Label>Enter Email</Form.Label>
                           <Form.Text
                              placeholder="Enter text"
                              onChange={e => handleChange(idx, e)}
                           />
                        </div>
                     </Form.Group>
                     <Spacer size="16px" />
                  </>
               )
            })}
            <ButtonTile
               type="secondary"
               text="Add New Email"
               onClick={() => handleAdd()}
            />
         </Flex>
      </>
   )
}
export default AddEmailAdresses
