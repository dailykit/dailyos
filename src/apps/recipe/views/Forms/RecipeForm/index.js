import React from 'react'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Input, Tunnel, Tunnels, useTunnel, Loader } from '@dailykit/ui'

import {
   state as initialState,
   reducers,
   RecipeContext,
} from '../../../context/recipee'
import { Context } from '../../../context/tabs'

import { StyledWrapper, StyledHeader, InputWrapper } from '../styled'

import { Information } from './components'
import { InformationTunnel } from './tunnels'
import { RECIPE, S_RECIPE } from '../../../graphql'

const RecipeForm = () => {
   // Context
   const { state: tabs } = React.useContext(Context)

   // States
   const [title, setTitle] = React.useState('')
   const [state, dispatch] = React.useState({})

   // Tunnels
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const { loading } = useSubscription(S_RECIPE, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         dispatch(data.subscriptionData.data.simpleRecipe)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Handlers
   const updateName = () => {
      //fire mutation
      // change tab title
   }

   if (loading) return <Loader />

   return (
      <React.Fragment>
         {/* Tunnels */}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <InformationTunnel state={state} closeTunnel={closeTunnel} />
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
         </StyledWrapper>
      </React.Fragment>
   )
}

export default RecipeForm
