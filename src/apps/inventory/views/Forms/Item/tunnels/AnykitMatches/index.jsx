import { Filler, TunnelHeader } from '@dailykit/ui'
import React from 'react'
import { Tooltip } from '../../../../../../../shared/components'
import { TunnelBody } from '../styled'

export default function AnykitMatchesTunnel({ close }) {
   return (
      <>
         <TunnelHeader
            title="Anykit Matches"
           close={() => close(1)}
            description="See matches from anykit."
            tooltip={
               <Tooltip identifier="supplier_item_form_anykit_matches_tunnel" />
            }
         />

         <TunnelBody>
            <Filler message="No matches found" />
         </TunnelBody>
      </>
   )
}
