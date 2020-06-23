import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import {
   ImageContainer,
   PhotoTileWrapper,
   StyledContainer,
   StyledStat,
   StyledStatsContainer,
} from './styled'
import { UPDATE_INGREDIENT } from '../../../../../graphql'

const Stats = ({ state, openTunnel }) => {
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: () => {
         toast.success('Image removed!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const removeImage = () => {
      updateIngredient({
         variables: {
            id: state.id,
            set: {
               image: '',
            },
         },
      })
   }

   return (
      <StyledContainer>
         <StyledStatsContainer>
            <StyledStat>
               <h2>{state.ingredientProcessings?.length}</h2>
               <p>Processings</p>
            </StyledStat>
            <StyledStat>
               <h2>{state.ingredientSachets?.length}</h2>
               <p>Sachets</p>
            </StyledStat>
         </StyledStatsContainer>
         {state.image ? (
            <ImageContainer>
               <div>
                  <span
                     role="button"
                     tabIndex="0"
                     onClick={() => openTunnel(1)}
                     onKeyDown={() => openTunnel(1)}
                  >
                     <EditIcon />
                  </span>
                  <span
                     role="button"
                     tabIndex="0"
                     onClick={removeImage}
                     onKeyDown={() => openTunnel(1)}
                  >
                     <DeleteIcon />
                  </span>
               </div>
               <img src={state.image} alt="Ingredient" />
            </ImageContainer>
         ) : (
            <PhotoTileWrapper>
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add Photo to your Ingredient"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => openTunnel(1)}
               />
            </PhotoTileWrapper>
         )}
      </StyledContainer>
   )
}

export default Stats
