import React from 'react'
import { OptionTile, Spacer, TunnelHeader } from '@dailykit/ui'
import { Tooltip } from '../../../../../../../../shared/components'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { TunnelBody } from '../../../tunnels/styled'

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
            <OptionTile
               title="Choose Existing Template"
               onClick={() => open(6)}
            />
            <Spacer size="16px" />
            <OptionTile
               title="Create New Template"
               onClick={() => {
                  modifiersDispatch({ type: 'RESET' })
                  open(2)
               }}
            />
         </TunnelBody>
      </>
   )
}

export default ModifierModeTunnel
