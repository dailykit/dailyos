import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   Flex,
   Text,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { Sachets } from '..'
import {
   AddIcon,
   DeleteIcon,
   FileIcon,
   DollarIcon,
} from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { DELETE_PROCESSING } from '../../../../../graphql'
import { Container } from '../styled'
import {
   Actions,
   StyledDisplay,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   StyledSection,
} from './styled'
import { NutritionTunnel, PriceTunnel, ProcessingsTunnel } from '../../tunnels'
import { Tooltip } from '../../../../../../../shared/components'

const Processings = ({ state }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [
      processingTunnels,
      openProcessingTunnel,
      closeProcessingTunnel,
   ] = useTunnel(1)
   const [
      nutritionTunnels,
      openNutritionTunnel,
      closeNutritionTunnel,
   ] = useTunnel(1)
   const [priceTunnels, openPriceTunnel, closePriceTunnel] = useTunnel(1)

   // Mutation
   const [deleteProcessing] = useMutation(DELETE_PROCESSING, {
      onCompleted: () => {
         toast.success('Processing deleted!')
         ingredientDispatch({
            type: 'PROCESSING_INDEX',
            payload: 0,
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handler
   const remove = processing => {
      if (
         window.confirm(
            `Do you want to delete processing - ${processing.processingName}?`
         )
      ) {
         deleteProcessing({
            variables: {
               id: processing.id,
            },
         })
      }
   }

   return (
      <>
         <Tunnels tunnels={processingTunnels}>
            <Tunnel layer={1}>
               <ProcessingsTunnel
                  state={state}
                  closeTunnel={closeProcessingTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={nutritionTunnels}>
            <Tunnel layer={1}>
               <NutritionTunnel state={state} close={closeNutritionTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={priceTunnels}>
            <Tunnel layer={1}>
               <PriceTunnel state={state} close={closePriceTunnel} />
            </Tunnel>
         </Tunnels>
         <Flex>
            {state.ingredientProcessings?.length ? (
               <StyledSection>
                  <StyledListing>
                     <StyledListingHeader>
                        <Flex container>
                           <Text as="h3">
                              Processings ({state.ingredientProcessings?.length}
                              )
                           </Text>
                           <Tooltip identifier="ingredient_form_processings" />
                        </Flex>
                        <span
                           role="button"
                           tabIndex="0"
                           onClick={() => openProcessingTunnel(1)}
                           onKeyDown={e =>
                              e.charCode === 13 && openProcessingTunnel(1)
                           }
                        >
                           <AddIcon color="#555B6E" size="18" stroke="2.5" />
                        </span>
                     </StyledListingHeader>
                     {state.ingredientProcessings?.map((processing, i) => (
                        <StyledListingTile
                           key={processing.id}
                           active={ingredientState.processingIndex === i}
                           onClick={() =>
                              ingredientDispatch({
                                 type: 'PROCESSING_INDEX',
                                 payload: i,
                              })
                           }
                        >
                           <Actions
                              active={ingredientState.processingIndex === i}
                           >
                              <span
                                 role="button"
                                 tabIndex="0"
                                 onClick={() => openPriceTunnel(1)}
                                 onKeyDown={e =>
                                    e.charCode === 13 && openPriceTunnel(1)
                                 }
                              >
                                 <DollarIcon color="#fff" />
                              </span>
                              <span
                                 role="button"
                                 tabIndex="0"
                                 onClick={() => openNutritionTunnel(1)}
                                 onKeyDown={e =>
                                    e.charCode === 13 && openNutritionTunnel(1)
                                 }
                              >
                                 <FileIcon color="#fff" />
                              </span>
                              <span
                                 role="button"
                                 tabIndex="0"
                                 onClick={() => remove(processing)}
                                 onKeyDown={e =>
                                    e.charCode === 13 && remove(processing)
                                 }
                              >
                                 <DeleteIcon />
                              </span>
                           </Actions>
                           <h3>{processing.processingName}</h3>
                           <p>
                              Sachets: {processing.ingredientSachets?.length}
                           </p>
                           <p>Recipes: NA</p>
                        </StyledListingTile>
                     ))}
                     <ButtonTile
                        type="primary"
                        size="lg"
                        onClick={() => openProcessingTunnel(1)}
                     />
                  </StyledListing>
                  <StyledDisplay>
                     <Sachets
                        state={state}
                        openNutritionTunnel={openNutritionTunnel}
                     />
                  </StyledDisplay>
               </StyledSection>
            ) : (
               <ButtonTile
                  type="primary"
                  size="lg"
                  text="Add Processings"
                  onClick={() => openProcessingTunnel(1)}
               />
            )}
         </Flex>
      </>
   )
}

export default Processings
