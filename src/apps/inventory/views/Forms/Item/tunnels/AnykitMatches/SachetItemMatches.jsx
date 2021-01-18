import { Filler, Flex, Spacer, TunnelHeader } from '@dailykit/ui'
import React from 'react'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'
import { TunnelBody } from '../styled'

export default function SachetItemMatches({ close, sachetItemId }) {
   const { error, sachetItemMatches, loading } = useAnykitMatches({
      sachetId: sachetItemId,
      showSachetMatches: true,
   })

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title="Anykit Sachet Item Matches"
            close={() => close(1)}
            description="See matches from anykit."
            tooltip={
               <Tooltip identifier="supplier_item_form_anykit_matches_tunnel" />
            }
         />

         <TunnelBody>
            {sachetItemMatches.length ? (
               <ul>
                  {sachetItemMatches.map(match => (
                     <Flex container as="li" key={match.id}>
                        <b>Ingredient:</b>{' '}
                        {match.sachet?.processing?.ingredient?.name}
                        <Spacer xAxis size="8px" />
                        <b>Processing:</b> {match.sachet?.processing?.name}
                     </Flex>
                  ))}
               </ul>
            ) : (
               <Filler message="No matches found" />
            )}
         </TunnelBody>
      </>
   )
}
