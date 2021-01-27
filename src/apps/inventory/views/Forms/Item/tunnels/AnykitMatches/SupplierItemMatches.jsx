import {
   Flex,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
   SectionTab,
   SectionTabList,
   SectionTabPanels,
   SectionTabs,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'
import { TunnelBody } from '../styled'

export default function SupplierItemMatches({ close, supplierItemId }) {
   // ...SectionTabs in ingredientsMatches
   // show pared ingredient name -> parsed from tab -> used in recipes
   // ...SectionTabs in sachetMatches
   // show ingredient, processing, sachetQuantity -> parsed from -> used in recipes

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
            <HorizontalTabs>
               <HorizontalTabList>
                  <HorizontalTab>Ingredients</HorizontalTab>
                  <HorizontalTab>Sachets</HorizontalTab>
               </HorizontalTabList>

               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <IngredientMatches supplierItemId={supplierItemId} />
                  </HorizontalTabPanel>

                  <HorizontalTabPanel>
                     <SachetMatches supplierItemId={supplierItemId} />
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </TunnelBody>
      </>
   )
}

function IngredientMatches({ supplierItemId }) {
   // supplierItemMatches: true returns both ingredientSupplierItemMatches
   // ...and sachetSupplierItemMatches
   const { error, ingredientSupplierItemMatches, loading } = useAnykitMatches({
      supplierItemId,
      showSupplierItemMatches: true /* default value */,
   })

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

   console.log(ingredientSupplierItemMatches)

   return (
      <SectionTabs>
         <SectionTabList>
            {ingredientSupplierItemMatches.map(ing => (
               <SectionTab key={ing.id}>
                  <Flex padding="14px" style={{ textAlign: 'left' }}>
                     {ing.ingredient?.name}
                  </Flex>
               </SectionTab>
            ))}
         </SectionTabList>
         <SectionTabPanels>
            {/* show panels */}
            Parsed from section tabs
         </SectionTabPanels>
      </SectionTabs>
   )
}

function SachetMatches({ supplierItemId }) {
   // supplierItemMatches: true returns both ingredientSupplierItemMatches
   // ...and sachetSupplierItemMatches
   // TODO: add option to get sachetSupplierItemMatches and ingredientSupplierItemMatches
   const { error, sachetSupplierItemMatches, loading } = useAnykitMatches({
      supplierItemId,
      showSupplierItemMatches: true /* default value */,
   })

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

   console.log(sachetSupplierItemMatches)

   return ''
}
