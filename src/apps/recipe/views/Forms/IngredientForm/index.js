import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Tunnels, Tunnel, useTunnel, Loader } from '@dailykit/ui'

import { StyledHeader, InputWrapper } from '../styled'
import { StyledMain } from './styled'
import {
   S_INGREDIENT,
   UPDATE_INGREDIENT,
   FETCH_PROCESSING_NAMES,
} from '../../../graphql'

import {
   state as initialState,
   reducers,
   IngredientContext,
} from '../../../context/ingredient'
import { Context } from '../../../context/tabs'

import { toast } from 'react-toastify'

import { Stats, Processings } from './components'
import { ProcessingsTunnel } from './tunnels'

const IngredientForm = () => {
   const { state: tabs, dispatch } = React.useContext(Context)
   const [ingredientState, ingredientDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   const [processings, setProcessings] = React.useState([])

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
   useSubscription(FETCH_PROCESSING_NAMES, {
      onSubscriptionData: data => {
         const processings = data.subscriptionData.data.masterProcessings.map(
            proc => ({ id: proc.id, title: proc.name })
         )
         setProcessings([...processings])
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
      <IngredientContext.Provider
         value={{ ingredientState, ingredientDispatch }}
      >
         <React.Fragment>
            {/* Tunnels */}
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <ProcessingsTunnel
                     state={state}
                     processings={processings}
                     closeTunnel={closeTunnel}
                  />
               </Tunnel>
            </Tunnels>
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
               <Processings state={state} openTunnel={openTunnel} />
            </StyledMain>
         </React.Fragment>
      </IngredientContext.Provider>
   )
}

export default IngredientForm
