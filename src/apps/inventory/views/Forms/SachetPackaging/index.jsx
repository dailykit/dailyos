import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import React, { useReducer } from 'react'
import { useParams } from 'react-router-dom'
import {
   SachetPackagingContext,
   sachetPackagingInitialState,
   sachetPackagingReducers,
} from '../../../context'
import { PACKAGING_SUBSCRIPTION } from '../../../graphql'
import { StyledWrapper } from '../styled'
import FormView from './FormView'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const { id } = useParams()

   const { loading, data: { packaging = {} } = {} } = useSubscription(
      PACKAGING_SUBSCRIPTION,
      {
         variables: { id },
      }
   )

   if (loading) return <Loader />

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
