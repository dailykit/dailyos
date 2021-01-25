import {
   Filler,
   Flex,
   List,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   Spacer,
   Text,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useMemo } from 'react'
import { NewTab } from '../../../../../../../shared/assets/icons'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'
import { TunnelBody } from '../styled'

export default function SupplierItemMatches({ close, supplierItemId }) {
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
            {/* Matched Ingredients */}
            {ingredientSupplierItemMatches.length ? (
               <IngredientSupplierItemMatchesSection
                  ingredientSupplierItemMatches={ingredientSupplierItemMatches}
               />
            ) : (
               <Filler message="No matches found" />
            )}
         </TunnelBody>
      </>
   )
}

function IngredientSupplierItemMatchesSection({
   ingredientSupplierItemMatches,
}) {
   const sachets = useMemo(() => {
      const result = []

      // loop through ingredientSupplierItemMatches, add sachets to result
      ingredientSupplierItemMatches.forEach(match => {
         if (!match) return
         if (!match.ingredient?.processings_aggregate?.nodes?.length) return

         match.ingredient.processings_aggregate.nodes.forEach(node => {
            if (!node) return
            result.push(...node.sachets)
         })
      })

      return result
   }, [ingredientSupplierItemMatches])

   return (
      <>
         <Flex container margin="0 0 8px 0" justifyContent="flex-start">
            <Text as="subtitle">Matched Ingredients</Text>
         </Flex>
         <SectionTabs>
            <SectionTabList>
               {sachets.map(sachet => (
                  <SectionTab key={sachet.id}>
                     <Flex padding="14px" style={{ textAlign: 'left' }}>
                        {sachet.minQuantity || sachet.maxQuantity}{' '}
                        {sachet.unit || 'unit'}
                     </Flex>
                  </SectionTab>
               ))}
            </SectionTabList>
            <SectionTabPanels>
               {sachets.map(sachet => {
                  return (
                     <SectionTabPanel key={sachet.id}>
                        <Text as="h1">{sachet.processing.ingredient.name}</Text>
                        <Text as="p">
                           Parsed from:{' '}
                           {sachet.rawingredient_sachets
                              ?.map(ing => `"${ing.rawIngredient.data}"`)
                              ?.join(', ')}
                        </Text>
                        <Spacer size="8px" />
                        <Text as="h2">Recipe(s): </Text>
                        <List>
                           {sachet.rawingredient_sachets
                              ?.map(ing => {
                                 const recipe = []

                                 ing.rawIngredient.recipe_ingredients.forEach(
                                    ri => {
                                       if (ri.recipe?.name)
                                          recipe.push(
                                             <Flex
                                                container
                                                alignItems="center"
                                                style={{
                                                   cursor: 'pointer',
                                                }}
                                                margin="8px"
                                                onClick={() =>
                                                   window.open(
                                                      ri.recipe.url,
                                                      '_blank'
                                                   )
                                                }
                                             >
                                                <Text
                                                   style={{
                                                      color: '#00a7e1',
                                                   }}
                                                   as="h3"
                                                >
                                                   {ri.recipe.name}
                                                </Text>
                                                <Spacer xAxis size="4px" />
                                                <NewTab />
                                             </Flex>
                                          )
                                    }
                                 )

                                 return recipe
                              })
                              .flat()}
                        </List>
                     </SectionTabPanel>
                  )
               })}
            </SectionTabPanels>
         </SectionTabs>
      </>
   )
}
