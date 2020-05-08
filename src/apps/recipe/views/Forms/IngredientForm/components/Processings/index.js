import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { AddIcon, DeleteIcon } from '../../../../../assets/icons'

import { Container } from '../styled'
import {
   StyledSection,
   StyledDisplay,
   StyledListing,
   StyledListingHeader,
   StyledListingTile,
   Actions,
} from './styled'

const Processings = ({ state, openTunnel }) => {
   return (
      <Container top="16" paddingX="32">
         {state.ingredientProcessings?.length ? (
            <StyledSection>
               <StyledListing>
                  <StyledListingHeader>
                     <h3>
                        Processings ({state.ingredientProcessings?.length})
                     </h3>
                     <span onClick={() => openTunnel(2)}>
                        <AddIcon color="#555B6E" size="18" stroke="2.5" />
                     </span>
                  </StyledListingHeader>
                  {state.ingredientProcessings?.map((processing, i) => (
                     <StyledListingTile key={processing.id}>
                        <Actions>
                           <span>
                              <DeleteIcon />
                           </span>
                        </Actions>
                        <h3>{processing.processingName}</h3>
                        <p>Sachets: {processing.ingredientSachets?.length}</p>
                        <p>Recipes: NA</p>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="lg"
                     onClick={() => openTunnel(2)}
                  />
               </StyledListing>
               <StyledDisplay>Hello</StyledDisplay>
            </StyledSection>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Title"
               onClick={() => openTunnel(2)}
            />
         )}
      </Container>
   )
}

export default Processings
