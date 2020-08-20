import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile } from '@dailykit/ui'
import { toast } from 'react-toastify'
// eslint-disable-next-line import/no-cycle
import { Sachet } from '..'
import { AddIcon, DeleteIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { DELETE_SACHET } from '../../../../../graphql'
import {
   Actions,
   StyledDisplay,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   StyledSection,
} from './styled'

const Sachets = ({
   state,
   openSachetTunnel,
   openEditSachetTunnel,
   openNutritionTunnel,
}) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   // Mutation
   const [deleteSachet] = useMutation(DELETE_SACHET, {
      onCompleted: () => {
         toast.success('Sachet deleted!')
         ingredientDispatch({
            type: 'SACHET_INDEX',
            payload: 0,
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handler
   const remove = sachet => {
      if (
         window.confirm(
            `Do you want to delete sachet - ${sachet.quantity}  ${sachet.unit}}?`
         )
      ) {
         deleteSachet({
            variables: {
               id: sachet.id,
            },
         })
      }
   }

   return (
      <>
         {state.ingredientProcessings[ingredientState.processingIndex]
            .ingredientSachets.length ? (
            <StyledSection>
               <StyledListing>
                  <StyledListingHeader>
                     <h3>
                        Sachets (
                        {
                           state.ingredientProcessings[
                              ingredientState.processingIndex
                           ].ingredientSachets.length
                        }
                        )
                     </h3>
                     <span
                        role="button"
                        tabIndex="0"
                        onClick={() => openSachetTunnel(1)}
                        onKeyDown={e =>
                           e.charCode === 13 && openSachetTunnel(1)
                        }
                     >
                        <AddIcon color="#555B6E" size="18" stroke="2.5" />
                     </span>
                  </StyledListingHeader>
                  {state.ingredientProcessings[
                     ingredientState.processingIndex
                  ].ingredientSachets?.map((sachet, i) => (
                     <StyledListingTile
                        key={sachet.id}
                        active={ingredientState.sachetIndex === i}
                        onClick={() =>
                           ingredientDispatch({
                              type: 'SACHET_INDEX',
                              payload: i,
                           })
                        }
                     >
                        <Actions active={ingredientState.sachetIndex === i}>
                           <span
                              role="button"
                              tabIndex="0"
                              onClick={() => remove(sachet)}
                              onKeyDown={e =>
                                 e.charCode === 13 && remove(sachet)
                              }
                           >
                              <DeleteIcon />
                           </span>
                        </Actions>
                        <h3>{`${sachet.quantity} ${sachet.unit}`}</h3>
                        <p>
                           Active:{' '}
                           {sachet.liveModeOfFulfillment?.type === 'realTime' &&
                              'Real Time'}
                           {sachet.liveModeOfFulfillment?.type ===
                              'plannedLot' && 'Planned Lot'}
                        </p>
                        <p>Available: NA</p>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="lg"
                     onClick={() => openSachetTunnel(1)}
                  />
               </StyledListing>
               <StyledDisplay>
                  <Sachet
                     state={state}
                     openEditSachetTunnel={openEditSachetTunnel}
                     openNutritionTunnel={openNutritionTunnel}
                  />
               </StyledDisplay>
            </StyledSection>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Sachet"
               onClick={() => openSachetTunnel(1)}
            />
         )}
      </>
   )
}

export default Sachets
