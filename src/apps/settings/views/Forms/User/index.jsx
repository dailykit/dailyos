import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { useTabs } from '../../../context'
import { Section, StyledTemp } from './styled'
import { initialState, reducers } from './store'
import { USERS } from '../../../graphql'
import { StyledWrapper, StyledHeader } from '../styled'
import { InlineLoader } from '../../../../../shared/components'
import { TextButton, Input, Text, HelperText } from '@dailykit/ui'

const UserForm = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const [isValid, setIsValid] = React.useState(false)
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [updateUser] = useMutation(USERS.UPDATE, {
      onCompleted: () => {
         toast.success('Updated user successfully!')
      },
      onError: () => {
         toast.error('Could not delete user, please try again!')
      },
   })
   const {
      loading,
      data: { settings_user_by_pk: user = {} } = {},
   } = useSubscription(USERS.USER, {
      variables: { id: params.id },
   })

   React.useEffect(() => {
      if (!tab && !loading && user?.id) {
         addTab(
            `${user.firstName} ${user.lastName || ''}`,
            `/settings/users/${user.id}`
         )
      }
   }, [tab, loading, addTab, user])

   React.useEffect(() => {
      if (!loading && !isEmpty(user)) {
         const { firstName, lastName, phoneNo, email } = user

         dispatch({
            type: 'SET_FIELD',
            payload: { field: 'firstName', value: firstName || '' },
         })
         dispatch({
            type: 'SET_FIELD',
            payload: { field: 'lastName', value: lastName || '' },
         })
         dispatch({
            type: 'SET_FIELD',
            payload: { field: 'phoneNo', value: phoneNo || '' },
         })
         dispatch({
            type: 'SET_FIELD',
            payload: { field: 'email', value: email || '' },
         })
      }
   }, [loading, user])

   const handleChange = e => {
      const { name, value } = e.target
      dispatch({ type: 'SET_FIELD', payload: { field: name, value } })
   }

   React.useEffect(() => {
      if (
         !state.firstName.value ||
         !state.lastName.value ||
         !state.email.value ||
         !state.phoneNo.value
      ) {
         setIsValid(false)
      } else {
         setIsValid(true)
      }
   }, [state])

   const createUser = () => {
      if (isEmpty(state.firstName.value)) {
      }
      updateUser({
         variables: {
            id: user.id,
            _set: {
               firstName: state.firstName.value,
               lastName: state.lastName.value,
               phoneNo: state.phoneNo.value,
               ...(!user?.email && { email: state.email.value }),
            },
         },
      })
   }

   if (loading) return <InlineLoader />
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">User Details</Text>
            {isValid && (
               <TextButton type="solid" onClick={() => createUser()}>
                  Save
               </TextButton>
            )}
         </StyledHeader>
         <div>
            <Section>
               <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={state.firstName.value}
                  onChange={e => handleChange(e)}
               />
               <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={state.lastName.value}
                  onChange={e => handleChange(e)}
               />
            </Section>
            <Section>
               <Input
                  type="text"
                  name="email"
                  label="Email"
                  disabled={user?.email}
                  value={state.email.value}
                  onChange={e => handleChange(e)}
               />
               <div>
                  <Input
                     type="text"
                     name="phoneNo"
                     label="Phone Number"
                     value={state.phoneNo.value}
                     onChange={e => handleChange(e)}
                  />
                  <HelperText type="hint" message="Eg. 987-987-9876" />
               </div>
            </Section>
            <StyledTemp>
               <span>Temporary Password</span>
               <span>{user?.tempPassword}</span>
               <HelperText
                  type="hint"
                  message="This is a first time login password, then the user will be asked to set new password."
               />
            </StyledTemp>
         </div>
      </StyledWrapper>
   )
}

export default UserForm
