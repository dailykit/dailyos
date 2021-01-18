import {Filler, Flex, Spacer, TunnelHeader} from '@dailykit/ui'
import React from 'react'
import {
  ErrorState,
  InlineLoader,
  Tooltip
} from '../../../../../../../shared/components'
import {logger} from '../../../../../../../shared/utils'
import {useAnykitMatches} from '../../../../../utils/useAnykitMatches'
import {TunnelBody} from '../styled'

export default function SupplierItemMatches({ close, supplierItemId }) {
   const { error, supplierItemMatches, loading } = useAnykitMatches({
      supplierItemId,
      showSachetMatches: false,
   })

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title="Anykit Supplier Item Matches"
            close={() => close(1)}
            description="See matches from anykit."
            tooltip={
               <Tooltip identifier="supplier_item_form_anykit_matches_tunnel" />
            }
         />

         <TunnelBody>
            {supplierItemMatches.length ? (
               <ul>
                  {supplierItemMatches.map(match => (
                     <Flex container as="li">
                        <b>Ingredient:</b> {match.ingredient.name}
                        <Spacer xAxis size="8px" />
                        <b>Processings:</b>{' '}
                        {match.ingredient.processings
                           .map(p => p.name)
                           .join(', ')}
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
