import React from 'react'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { TagGroup, ButtonTile, Tag } from '@dailykit/ui'

import { StyledRow, StyledContainer } from './styled'

const Description = ({ openTunnel }) => {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   return (
      <React.Fragment>
         {state.description || state.tags.length ? (
            <StyledContainer onClick={() => openTunnel(1)}>
               <StyledRow>
                  <TagGroup>
                     {state.tags.map(tag => (
                        <Tag>{tag}</Tag>
                     ))}
                  </TagGroup>
               </StyledRow>
               <StyledRow>
                  <p>{state.description}</p>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Description"
               onClick={() => openTunnel(1)}
            />
         )}
      </React.Fragment>
   )
}

export default Description
