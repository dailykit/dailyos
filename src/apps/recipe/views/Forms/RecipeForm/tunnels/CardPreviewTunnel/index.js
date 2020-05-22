import React from 'react'
import { TunnelHeader, TunnelBody, StyledRow, ImageContainer } from '../styled'
import { CloseIcon } from '../../../../../assets/icons'
import { Text } from '@dailykit/ui'
import { RecipeContext } from '../../../../../context/recipee'

const CardPreviewTunnel = ({ closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(9)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Card Preview: {recipeState.preview.title}</Text>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <Text as="title">Front</Text>
            </StyledRow>
            <StyledRow>
               <ImageContainer>
                  <img src={recipeState.preview.img} />
               </ImageContainer>
            </StyledRow>
         </TunnelBody>
      </React.Fragment>
   )
}

export default CardPreviewTunnel
