import {
   Flex,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   Spacer,
   Text,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useCallback, useEffect, useState } from 'react'
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

   const getParsedFrom = useCallback(
      ing => {
         const result = []

         ing.processings.forEach(proc => {
            proc.sachets.forEach(sachet => {
               sachet.rawingredient_sachets.forEach(rs => {
                  result.push(rs.rawIngredient)
               })
            })
         })

         return result
      },
      [ingredientSupplierItemMatches]
   )

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

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
            {ingredientSupplierItemMatches.map(ing => {
               const rawIngs = getParsedFrom(ing.ingredient)
               return (
                  <SectionTabPanel key={ing.id}>
                     <SectionTabs>
                        <SectionTabList>
                           <Text as="subtitle">Parsed from </Text>
                           <Spacer size="8px" />
                           {rawIngs.map(rawIng => (
                              <SectionTab key={rawIng.id}>
                                 <Flex
                                    padding="14px"
                                    style={{ textAlign: 'left' }}
                                 >
                                    {rawIng.data}
                                 </Flex>
                              </SectionTab>
                           ))}
                        </SectionTabList>
                        <SectionTabPanels>
                           {rawIngs.map(rawIng => {
                              return (
                                 <SectionTabPanel key={rawIng.id}>
                                    <Text as="h3">Used in Recipes</Text>
                                    <Spacer size="8px" />
                                    <RecipeSource rawIngredientId={rawIng.id} />
                                 </SectionTabPanel>
                              )
                           })}
                        </SectionTabPanels>
                     </SectionTabs>
                  </SectionTabPanel>
               )
            })}
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

   return (
      <SectionTabs>
         <SectionTabList>
            {sachetSupplierItemMatches.map(match => (
               <SectionTab key={match.id}>
                  <Flex padding="14px" style={{ textAlign: 'left' }}>
                     {/* refactor it into a function for handling null values */}
                     {match.sachet.processing.ingredient.name},{' '}
                     {match.sachet.processing.name},{' '}
                     {match.sachet.minQuantity || match.sachet.maxQuantity}{' '}
                     {match.sachet.unit || 'unit'}
                  </Flex>
               </SectionTab>
            ))}
         </SectionTabList>
         <SectionTabPanels>
            {sachetSupplierItemMatches.map(match => (
               <SectionTabPanel key={match.id}>
                  <SectionTabs>
                     <SectionTabList>
                        <Text as="subtitle">Parsed from</Text>
                        <Spacer size="8px" />
                        {match.sachet.rawingredient_sachets.map(rs => (
                           <SectionTab key={rs.rawIngredient.id}>
                              <Flex
                                 padding="14px"
                                 style={{ textAlign: 'left' }}
                              >
                                 {rs.rawIngredient.data}
                              </Flex>
                           </SectionTab>
                        ))}
                     </SectionTabList>
                     <SectionTabPanels>
                        {match.sachet.rawingredient_sachets.map(rs => (
                           <SectionTabPanel key={rs.rawIngredient.id}>
                              <Text as="h3">Used in Recipes</Text>
                              <Spacer size="8px" />
                              <RecipeSource
                                 rawIngredientId={rs.rawIngredient.id}
                              />
                           </SectionTabPanel>
                        ))}
                     </SectionTabPanels>
                  </SectionTabs>
               </SectionTabPanel>
            ))}
         </SectionTabPanels>
      </SectionTabs>
   )
}

function RecipeSource({ rawIngredientId }) {
   const [recipes, setRecipes] = useState([])
   const { getRecipeByRawIngredient } = useAnykitMatches({})

   useEffect(() => {
      getRecipeByRawIngredient(rawIngredientId).then(resc => setRecipes(resc))
   }, [rawIngredientId])

   return (
      <>
         {recipes.map(data => (
            <Flex
               key={data.recipe.id}
               as="button"
               container
               alignItems="center"
               style={{ cursor: 'pointer', background: 'none', border: '0' }}
               onClick={() => {
                  window.open(data.recipe.url, '_blank')
               }}
            >
               <Text style={{ color: '#00A7E1' }} as="h2">
                  {data.recipe.name}
               </Text>
               <Spacer xAxis size="4px" />
               <NewTab />
            </Flex>
         ))}
      </>
   )
}
