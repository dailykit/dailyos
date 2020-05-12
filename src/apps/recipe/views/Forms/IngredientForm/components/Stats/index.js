import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import {
   ImageContainer,
   PhotoTileWrapper,
   StyledContainer,
   StyledStat,
   StyledStatsContainer,
} from './styled'

const Stats = ({ state, openTunnel }) => {
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
                  <span>
                     <EditIcon />
                  </span>
                  <span>
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
               />
            </PhotoTileWrapper>
         )}
      </StyledContainer>
   )
}

export default Stats
