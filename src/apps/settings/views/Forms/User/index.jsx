import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useParams, useHistory } from 'react-router-dom'

// Components
import { TextButton, Input, Text, HelperText, Loader } from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { CREATE_USER, USER } from '../../../graphql'
import { initialState, reducers } from './store'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'
import { Section, StyledTemp } from './styled'

const UserForm = () => {
   const params = useParams()
   const history = useHistory()
   const { tabs, doesTabExists, removeTab } = useTabs()
   const [state, dispatch] = React.useReducer(reducers, initialState)

   const {
      error,
      loading,
      data: { settings_user_by_pk: user = {} } = {},
   } = useSubscription(USER, { variables: { id: params.name } })

   const [addUser] = useMutation(CREATE_USER, {
      onCompleted: () => {
         const condition = node =>
            node.path === `/settings/users/${params.name}`
         const index = tabs.findIndex(condition)
         const tab = tabs.find(condition)
         removeTab(null, { tab, index })
      },
   })

   React.useEffect(() => {
      const tab = doesTabExists(`/settings/users/${params.name}`)
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings/users')
      }
   }, [params.name, history])

   const handleChange = e => {
      const { name, value } = e.target
      dispatch({ type: 'SET_FIELD', payload: { field: name, value } })
   }

   const createUser = () => {
      addUser({
         variables: {
            object: {
               firstName: state.firstName.value,
               lastName: state.lastName.value,
               email: state.email.value,
               phoneNo: state.phoneNo.value,
               tempPassword: params.name.slice(4),
            },
         },
      })
   }

   if (loading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">
               {Object.keys(user).length === 0 ? 'New User' : 'User Details'}
            </Text>
            {Object.keys(user).length === 0 && (
               <TextButton type="solid" onClick={() => createUser()}>
                  Publish
               </TextButton>
            )}
         </StyledHeader>
         <div>
            <Section>
               <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={user.firstName || state.firstName.value}
                  onChange={e => handleChange(e)}
               />
               <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={user.lastName || state.lastName.value}
                  onChange={e => handleChange(e)}
               />
            </Section>
            <Section>
               <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={user.email || state.email.value}
                  onChange={e => handleChange(e)}
               />
               <div>
                  <Input
                     type="text"
                     name="phoneNo"
                     label="Phone Number"
                     value={user.phoneNo || state.phoneNo.value}
                     onChange={e => handleChange(e)}
                  />
                  <HelperText type="hint" message="Eg. 987-987-9876" />
               </div>
            </Section>
            <StyledTemp>
               <span>Temporary Password</span>
               <span>{user.tempPassword || params.name.slice(4)}</span>
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
