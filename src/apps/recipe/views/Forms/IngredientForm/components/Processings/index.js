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
import { IngredientContext } from '../../../../../context/ingredient'

import { Sachets } from '../'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_PROCESSING } from '../../../../../graphql'
import { toast } from 'react-toastify'

const Processings = ({ state, openTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

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
      <Container top="16" paddingX="32">
         {state.ingredientProcessings?.length ? (
            <StyledSection>
               <StyledListing>
                  <StyledListingHeader>
                     <h3>
                        Processings ({state.ingredientProcessings?.length})
                     </h3>
                     <span onClick={() => openTunnel(1)}>
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
                        <Actions active={ingredientState.processingIndex === i}>
                           <span onClick={() => remove(processing)}>
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
                     onClick={() => openTunnel(1)}
                  />
               </StyledListing>
               <StyledDisplay>
                  <Sachets state={state} openTunnel={openTunnel} />
               </StyledDisplay>
            </StyledSection>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Processings"
               onClick={() => openTunnel(1)}
            />
         )}
      </Container>
   )
}

export default Processings
