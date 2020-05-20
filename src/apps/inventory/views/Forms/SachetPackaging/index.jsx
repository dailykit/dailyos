import React, { useReducer } from 'react'
import { Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

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
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <>
         <SachetPackagingContext.Provider
            value={(sachetPackagingState, sachetPackagingDispatch)}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <h2>Tunnel 1</h2>
               </Tunnel>
            </Tunnels>

            <StyledWrapper>
               <h1>Hellow sachets</h1>
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}
