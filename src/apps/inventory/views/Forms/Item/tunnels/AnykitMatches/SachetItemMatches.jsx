import {
   Flex,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   Spacer,
   Text,
   TunnelHeader,
   Toggle,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTab,
   HorizontalTabPanel,
   HorizontalTabPanels,
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

export default function SachetItemMatches({ close, sachetItemId }) {
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
            <HorizontalTabs>
               <HorizontalTabList>
                  <HorizontalTab>Ingredients</HorizontalTab>
                  <HorizontalTab>Sachets</HorizontalTab>
               </HorizontalTabList>

               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <IngredientSachetItemMatches sachetItemId={sachetItemId} />
                  </HorizontalTabPanel>

                  <HorizontalTabPanel>
                     <SachetSachetItemMatches sachetItemId={sachetItemId} />
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </TunnelBody>
      </>
   )
}

function SachetSachetItemMatches({ sachetItemId }) {
   const { error, sachetItemMatches, loading, setApproved } = useAnykitMatches({
      sachetId: sachetItemId,
      showSachetItemMatches: true,
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

   if (!sachetItemMatches.length)
      return <ErrorState message="No matches found!" />

   return (
      <SectionTabs>
         <SectionTabList>
            {sachetItemMatches.map(match => (
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
            {sachetItemMatches.map(match => (
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
                                       checked={rs.rawIngredient.isApproved}
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
            ))}
         </SectionTabPanels>
      </SectionTabs>
   )
}

function IngredientSachetItemMatches({ sachetItemId }) {
   const {
      error,
      ingredientSachetItemMatches,
      setApproved,
      loading,
   } = useAnykitMatches({
      sachetId: sachetItemId,
      showIngredientSachetItemMatches: true,
   })

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
      [ingredientSachetItemMatches]
   )

   const handleSetApproved = async rawIng => {
      const message = await setApproved(rawIng.matchId, !rawIng.isApproved, {
         isSachetMatch: false,
      })

      if (typeof message === 'string') toast.info(message)
   }

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (loading) return <InlineLoader />

   if (!ingredientSachetItemMatches.length)
      return <ErrorState message="No matches found!" />

   return (
      <SectionTabs>
         <SectionTabList>
            {ingredientSachetItemMatches.map(ing => (
               <SectionTab key={ing.id}>
                  <Flex padding="14px" style={{ textAlign: 'left' }}>
                     {ing.ingredient?.name}
                  </Flex>
               </SectionTab>
            ))}
         </SectionTabList>
         <SectionTabPanels>
            {ingredientSachetItemMatches.map(ing => {
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
                             console.log(rawIng)
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
