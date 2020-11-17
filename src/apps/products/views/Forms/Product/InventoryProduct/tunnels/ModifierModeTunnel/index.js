import React from 'react'
import { TunnelHeader, Text } from '@dailykit/ui'
import { TunnelBody, SolidTile } from '../styled'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { Tooltip } from '../../../../../../../../shared/components'

const ModifierModeTunnel = ({ open, close }) => {
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   return (
      <>
         <TunnelHeader
            title="Choose Method"
            close={() => close(1)}
            tooltip={<Tooltip identifier="modifier_mode_tunnel" />}
         />
         <TunnelBody>
            <SolidTile onClick={() => open(6)}>
               <Text as="h1">Choose Existing Template</Text>
            </SolidTile>
            <br />
            <SolidTile
               onClick={() => {
                  modifiersDispatch({ type: 'RESET' })
                  open(2)
               }}
            >
               <Text as="h1">Create New Template</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ModifierModeTunnel
