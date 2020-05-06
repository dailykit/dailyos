import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Tunnel, Tunnels, useTunnel, Loader } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

import { StyledWrapper, StyledHeader, InputWrapper } from '../styled'

import { Information, Procedures } from './components'
import { InformationTunnel, ProceduresTunnel } from './tunnels'
import { UPDATE_RECIPE, S_RECIPE } from '../../../graphql'

const RecipeForm = () => {
   // Context
   const { state: tabs, dispatch } = React.useContext(Context)

   // States
   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Tunnels
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscription
   const { loading } = useSubscription(S_RECIPE, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.simpleRecipe)
         setTitle(data.subscriptionData.data.simpleRecipe.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            name: title,
         },
      },
      onCompleted: () => {
         toast.success('Name updated!')
         dispatch({
            type: 'SET_TITLE',
            payload: { oldTitle: tabs.current.title, title },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   // Handlers
   const updateName = () => {
      updateRecipe()
   }

   if (loading) return <Loader />

   return (
      <React.Fragment>
         {/* Tunnels */}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <InformationTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProceduresTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {/* View */}
         <StyledHeader>
            <InputWrapper>
               <Input
                  type="text"
                  label="Recipe Title"
                  name="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={updateName}
               />
            </InputWrapper>
         </StyledHeader>
         <StyledWrapper>
            <Information state={state} openTunnel={openTunnel} />
            {/* Photo component */}
            <Procedures state={state} openTunnel={openTunnel} />
         </StyledWrapper>
      </React.Fragment>
   )
}

export default RecipeForm
