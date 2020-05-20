import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { Sachet } from '../'
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

const Sachets = ({ state, openTunnel }) => {
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
            `Do you want to delete sachet - ${
               sachet.quantity + ' ' + sachet.unit
            }?`
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
      <React.Fragment>
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
                     <span onClick={() => openTunnel(2)}>
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
                           <span onClick={() => remove(sachet)}>
                              <DeleteIcon />
                           </span>
                        </Actions>
                        <h3>{sachet.quantity + ' ' + sachet.unit}</h3>
                        <p>
                           Active:{' '}
                           {sachet.liveModeOfFulfillment
                              ? sachet.liveModeOfFulfillment.type === 'realTime'
                                 ? 'Real Time'
                                 : 'Planned Lot'
                              : 'NA'}
                        </p>
                        <p>Available: NA</p>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="lg"
                     onClick={() => openTunnel(2)}
                  />
               </StyledListing>
               <StyledDisplay>
                  <Sachet state={state} openTunnel={openTunnel} />
               </StyledDisplay>
            </StyledSection>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Sachet"
               onClick={() => openTunnel(2)}
            />
         )}
      </React.Fragment>
   )
}

export default Sachets
