import React from 'react'
import { Text, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

import { Container } from '../styled'

import {
   BrandSettings,
   VisualSettings,
   AvailabilitySettings,
} from './components'
import { AssetsTunnel } from './tunnels'

const Main = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [updating, setUpdating] = React.useState({
      type: 'brand',
      identifier: 'Logo',
   })

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <AssetsTunnel closeTunnel={closeTunnel} updating={updating} />
            </Tunnel>
         </Tunnels>
         <Container paddingX="32" paddingY="32" left="300">
            <Text as="h1">Store Settings</Text>
            <Container paddingY="60" bottom="32">
               <BrandSettings
                  setUpdating={setUpdating}
                  openTunnel={openTunnel}
               />
               <VisualSettings
                  setUpdating={setUpdating}
                  openTunnel={openTunnel}
               />
               <AvailabilitySettings />
            </Container>
         </Container>
      </>
   )
}

export default Main
