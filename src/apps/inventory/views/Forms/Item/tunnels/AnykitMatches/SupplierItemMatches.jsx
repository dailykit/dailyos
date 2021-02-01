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
   Toggle,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useCallback } from 'react'
import { toast } from 'react-toastify'

import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { useAnykitMatches } from '../../../../../utils/useAnykitMatches'
import { TunnelBody } from '../styled'
import { RecipeSource } from './RecipeSource'

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
   const {
      error,
      ingredientSupplierItemMatches,
      setApproved,
      loading,
   } = useAnykitMatches({
      supplierItemId,
      showSupplierItemMatches: true,
   })

   const handleSetApproved = async rawIng => {
      const message = await setApproved(rawIng.matchId, !rawIng.isApproved, {
         isSachetMatch: false,
      })

      if (typeof message === 'string') toast.info(message)
   }

   const getParsedFrom = useCallback(
      match => {
         const result = []

         match.ingredient.processings.forEach(proc => {
            proc.sachets.forEach(sachet => {
               sachet.rawingredient_sachets.forEach(rs => {
                  result.push({
                     ...rs.rawIngredient,
                     matchId: match.id,
                     isApproved: match.isApproved,
                  })
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
               const rawIngs = getParsedFrom(ing)
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
                                    <Flex
                                       container
                                       justifyContent="space-between"
                                    >
                                       <Flex>
                                          <Text as="h3">Used in Recipes</Text>
                                          <Spacer size="8px" />
                                          <RecipeSource
                                             rawIngredientId={rawIng.id}
                                          />
                                       </Flex>
                                       <Spacer xAxis size="18px" />
                                       <Flex>
                                          <Toggle
                                             checked={rawIng.isApproved}
                                             label="Is Approved"
                                             setChecked={() =>
                                                handleSetApproved(rawIng)
                                             }
                                          />
                                       </Flex>
                                    </Flex>
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
   const {
      error,
      sachetSupplierItemMatches,
      loading,
      setApproved,
   } = useAnykitMatches({
      supplierItemId,
      showSupplierItemMatches: true /* default value */,
   })

   const handleSetApproved = async match => {
      const message = await setApproved(match.id, !match.isApproved, {
         isSachetMatch: true,
      })

      if (typeof message === 'string') toast.info(message)
   }

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
            {sachetSupplierItemMatches.map(match => {
               console.log('isApproved', match.isApproved)
               return (
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
                                 <Flex container justifyContent="space-between">
                                    <Flex>
                                       <Text as="h3">Used in Recipes</Text>
                                       <Spacer size="8px" />
                                       <RecipeSource
                                          rawIngredientId={rs.rawIngredient.id}
                                       />
                                    </Flex>
                                    <Spacer xAxis size="18px" />
                                    <Flex>
                                       <Toggle
                                          checked={match.isApproved}
                                          label="Is Approved"
                                          setChecked={() =>
                                             handleSetApproved(match)
                                          }
                                       />
                                    </Flex>
                                 </Flex>
                              </SectionTabPanel>
                           ))}
                        </SectionTabPanels>
                     </SectionTabs>
                  </SectionTabPanel>
               )
            })}
         </SectionTabPanels>
      </SectionTabs>
   )
}
