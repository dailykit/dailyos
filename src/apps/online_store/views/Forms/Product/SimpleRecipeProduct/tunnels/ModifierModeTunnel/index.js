import React from 'react'
import { TunnelHeader, Text } from '@dailykit/ui'
import { TunnelBody, SolidTile } from '../styled'

const ModifierModeTunnel = ({ open, close }) => {
   return (
      <>
         <TunnelHeader title="Choose Method" close={() => close(1)} />
         <TunnelBody>
            <SolidTile onClick={() => open(6)}>
               <Text as="h1">Choose Existing Template</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => open(2)}>
               <Text as="h1">Create New Template</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ModifierModeTunnel
