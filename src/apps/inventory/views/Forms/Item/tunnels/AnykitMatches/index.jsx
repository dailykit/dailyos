import { Filler, TunnelHeader } from '@dailykit/ui'
import React, { useEffect } from 'react'
import { Tooltip } from '../../../../../../../shared/components'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'
import { TunnelBody } from '../styled'

export default function AnykitMatchesTunnel({ close, supplierItemId }) {
  const { error, supplierItemMatches } = useAnykitMatches({ supplierItemId, showSachetMatches: false })

   console.log(supplierItemMatches)

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
