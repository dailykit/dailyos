import React from 'react'
import { TunnelHeader, Text, OptionTile, Spacer } from '@dailykit/ui'
import { TunnelBody, SolidTile } from '../../../tunnels/styled'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { Tooltip } from '../../../../../../../../shared/components'

const ModifierTypeTunnel = ({ open, close }) => {
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   const select = type => {
      modifiersDispatch({
         type: 'META',
         payload: {
            name: 'modifierProductType',
            value: type,
         },
      })
      open(4)
   }

   return (
      <>
         <TunnelHeader
            title="Choose Option Type"
            close={() => close(3)}
            tooltip={<Tooltip identifier="modifier_option_type_tunnel" />}
         />
         <TunnelBody>
            <OptionTile
               title="Simple Product"
               onClick={() => select('simpleProductOption')}
            />
            <Spacer size="16px" />
            <OptionTile
               title="Sachet Item"
               onClick={() => select('sachetItem')}
            />
            <Spacer size="16px" />
            <OptionTile title="Bulk Item" onClick={() => select('bulkItem')} />
            <Spacer size="16px" />
            <OptionTile
               title="Supplier Item"
               onClick={() => select('supplierItem')}
            />
         </TunnelBody>
      </>
   )
}

export default ModifierTypeTunnel
