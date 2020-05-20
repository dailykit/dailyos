import React, { useReducer } from 'react'

import {
   sachetPackagingInitialState,
   sachetPackagingReducers,
   SachetPackagingContext,
} from '../../../context'

import { StyledWrapper } from '../styled'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )

   return (
      <>
         <SachetPackagingContext.Provider
            value={(sachetPackagingState, sachetPackagingDispatch)}
         >
            <StyledWrapper>
               <h1>Hellow Sachets</h1>
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}
