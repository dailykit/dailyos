import React, { useReducer, useContext } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'

import {
   sachetPackagingInitialState,
   sachetPackagingReducers,
   SachetPackagingContext,
} from '../../../context'
import { Context } from '../../../context/tabs'

import { StyledWrapper } from '../styled'

import FormView from './FormView'

import { PACKAGING_SUBSCRIPTION } from '../../../graphql'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)

   const { loading, data: { packaging = {} } = {} } = useSubscription(
      PACKAGING_SUBSCRIPTION,
      {
         variables: { id },
      }
   )

   if (loading) return <Loader />

   console.log(packaging)

   return (
      <>
         <SachetPackagingContext.Provider
            value={{ sachetPackagingState, sachetPackagingDispatch }}
         >
            <StyledWrapper>
               <FormView state={packaging} />
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}
