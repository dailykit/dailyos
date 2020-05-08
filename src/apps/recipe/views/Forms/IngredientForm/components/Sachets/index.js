import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { AddIcon, DeleteIcon } from '../../../../../assets/icons'

import {
   StyledSection,
   StyledDisplay,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   Actions,
} from './styled'
import { IngredientContext } from '../../../../../context/ingredient'

import { Sachet } from '../'

const Sachets = ({ state, openTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

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
                           <span>
                              <DeleteIcon />
                           </span>
                        </Actions>
                        <h3>{sachet.quantity + ' ' + sachet.unit}</h3>
                        <p>Active: {sachet.liveMOF || 'NA'}</p>
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
