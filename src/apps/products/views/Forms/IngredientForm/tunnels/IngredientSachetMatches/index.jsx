import React, {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {
   Flex,
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
import { TunnelBody } from '../styled'
import { useAnykitMatches } from '../../../../../../inventory/utils/useAnykitMatches'
import {
   ErrorState,
   InlineLoader,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { NewTab } from '../../../../../../../shared/assets/icons'

const IngredientSachetMatches = ({ sachetId, close }) => {
   const {
      ingredientSachetMatches,
      setApproved,
      loading,
      error,
   } = useAnykitMatches({
      sachetId,
      showIngredientSachetMatches: true,
   })

   const handleSetApproved = async match => {
      const message = await setApproved(match.id, !match.isApproved)

      if (typeof message === 'string') toast.info(message)
   }

   if (loading) return <InlineLoader />

   if (error) {
      logger(error)
      return <ErrorState />
   }

   console.log(ingredientSachetMatches)

   return (
      <>
         <TunnelHeader
            title="Anykit Matches"
            description="Sachets from anykit that matched with this Ingredient Sachet"
            close={() => close(1)}
         />
         <TunnelBody>
            <SectionTabs>
               <SectionTabList>
                  {ingredientSachetMatches.map(match => (
                     <SectionTab key={match.id}>
                        <Flex padding="14px" style={{ textAlign: 'left' }}>
                           {/* refactor it into a function for handling null values */}
                           {match.sachet.processing.ingredient.name},{' '}
                           {match.sachet.processing.name},{' '}
                           {match.sachet.minQuantity ||
                              match.sachet.maxQuantity}{' '}
                           {match.sachet.unit || 'unit'}
                        </Flex>
                     </SectionTab>
                  ))}
               </SectionTabList>
               <SectionTabPanels>
                  {ingredientSachetMatches.map(match => {
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
                                       <Flex
                                          container
                                          justifyContent="space-between"
                                       >
                                          <Flex>
                                             <Text as="h3">
                                                Used in Recipes
                                             </Text>
                                             <Spacer size="8px" />
                                             <RecipeSource
                                                rawIngredientId={
                                                   rs.rawIngredient.id
                                                }
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
         </TunnelBody>
      </>
   )
}

function RecipeSource({ rawIngredientId })  {
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

export default IngredientSachetMatches
