import React from 'react'
import {
   Flex,
   Tunnel,
   Tunnels,
   Spacer,
   OptionTile,
   TunnelHeader,
} from '@dailykit/ui'

import { Provider, useManual } from './state'
import { BrandTunnel, CustomerTunnel } from './tunnels'

export const CreateManualOrder = ({ isModeTunnelOpen }) => {
   return (
      <Provider isModeTunnelOpen={isModeTunnelOpen}>
         <Content />
      </Provider>
   )
}

const Content = () => {
   const { tunnels, dispatch } = useManual()

   const setMode = mode => {
      dispatch({ type: 'SET_MODE', payload: mode })
      tunnels.open(2)
   }
   return (
      <Tunnels tunnels={tunnels.list}>
         <Tunnel size="md">
            <TunnelHeader title="Select Store" close={() => tunnels.close(1)} />
            <Flex padding="16px" overflowY="auto" height="calc(100vh - 196px)">
               <OptionTile
                  title="On-demand Store"
                  onClick={() => setMode('ONDEMAND')}
               />
               <Spacer size="16px" />
               <OptionTile
                  title="Subscription Store"
                  onClick={() => setMode('SUBSCRIPTION')}
               />
            </Flex>
         </Tunnel>
         <Tunnel size="md">
            <BrandTunnel />
         </Tunnel>
         <Tunnel size="md">
            <CustomerTunnel />
         </Tunnel>
      </Tunnels>
   )
}
