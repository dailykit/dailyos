import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { toast } from 'react-toastify'
// eslint-disable-next-line import/no-cycle
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
import { NutritionTunnel, PriceTunnel } from '../../tunnels'

const Processings = ({
   state,
   openProcessingTunnel,
   openSachetTunnel,
   openEditSachetTunnel,
}) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

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
         <Container top="16" paddingX="32">
            {state.ingredientProcessings?.length ? (
               <StyledSection>
                  <StyledListing>
                     <StyledListingHeader>
                        <h3>
                           Processings ({state.ingredientProcessings?.length})
                        </h3>
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
                        openSachetTunnel={openSachetTunnel}
                        openEditSachetTunnel={openEditSachetTunnel}
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
         </Container>
      </>
   )
}

export default Processings
