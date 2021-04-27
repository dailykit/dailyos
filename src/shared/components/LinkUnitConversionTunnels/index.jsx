import React from 'react'
import { Tunnel, Tunnels } from '@dailykit/ui'
import { CreateUnitConversion, UnitConversionsListing } from './tunnels'

const LinkConversionsTunnels = ({
   preselected,
   tunnels,
   openTunnel,
   closeTunnel,
   onSave,
}) => {
   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <UnitConversionsListing
               preselected={preselected}
               openTunnel={openTunnel}
               closeTunnel={closeTunnel}
               onSave={onSave}
            />
         </Tunnel>
         <Tunnel layer={2}>
            <CreateUnitConversion closeTunnel={closeTunnel} />
         </Tunnel>
      </Tunnels>
   )
}

export default LinkConversionsTunnels
