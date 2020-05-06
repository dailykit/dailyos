import React from 'react'
import { Input, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'

import {
   state as initialState,
   reducer,
   RecipeContext,
} from '../../../context/recipee'

import { StyledWrapper, StyledHeader, InputWrapper } from '../styled'

const RecipeForm = () => {
   // States
   const [title, setTitle] = React.useState('')
   const [state, dispatch] = React.useReducer(reducer, initialState)

   // Tunnels
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Handlers
   const updateName = () => {
      //fire mutation
      // change tab title
   }

   return (
      <RecipeContext.Provider value={{ state, dispatch }}>
         <React.Fragment>
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
               <Tunnels tunnels={tunnels}>
                  <Tunnel layer={1}></Tunnel>
               </Tunnels>
            </StyledWrapper>
         </React.Fragment>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
