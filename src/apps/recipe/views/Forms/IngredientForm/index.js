import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Input, Tunnels, Tunnel, useTunnel, Loader } from '@dailykit/ui'

import { StyledHeader, InputWrapper, StyledWrapper } from '../styled'
import { S_INGREDIENT } from '../../../graphql'
import { Context } from '../../../context/tabs'

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
   const updateName = () => {}

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
                  onBlur={updateName}
               />
            </InputWrapper>
         </StyledHeader>
         <StyledWrapper width="980"></StyledWrapper>
      </React.Fragment>
   )
}

export default IngredientForm
