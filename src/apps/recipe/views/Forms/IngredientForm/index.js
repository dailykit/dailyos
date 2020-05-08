import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Tunnels, Tunnel, useTunnel, Loader } from '@dailykit/ui'

import { StyledHeader, InputWrapper, StyledWrapper } from '../styled'
import { StyledMain } from './styled'
import { S_INGREDIENT, UPDATE_INGREDIENT } from '../../../graphql'
import { Context } from '../../../context/tabs'
import { toast } from 'react-toastify'

import { Stats } from './components'

const IngredientForm = () => {
   const { state: tabs, dispatch } = React.useContext(Context)

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscriptions
   const { loading } = useSubscription(S_INGREDIENT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.ingredient)
         setTitle(data.subscriptionData.data.ingredient.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutations
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
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
            payload: {
               oldTitle: tabs.current.title,
               title,
            },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers

   if (loading) return <Loader />

   return (
      <React.Fragment>
         {/* Tunnels */}
         {/* <Tunnels tunnels={tunnels}>
         </Tunnels> */}
         {/* View */}
         <StyledHeader>
            <InputWrapper>
               <Input
                  type="text"
                  label="Ingredient Name"
                  name="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={updateIngredient}
               />
            </InputWrapper>
         </StyledHeader>
         <StyledMain>
            <Stats state={state} openTunnel={openTunnel} />
         </StyledMain>
      </React.Fragment>
   )
}

export default IngredientForm
