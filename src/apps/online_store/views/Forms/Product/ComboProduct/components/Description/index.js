import React from 'react'
import { TagGroup, ButtonTile, Tag, IconButton } from '@dailykit/ui'

import { StyledRow, StyledContainer, StyledAction } from './styled'
import { EditIcon } from '../../../../../../assets/icons'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'

const Description = ({ openTunnel }) => {
   const { state, dispatch } = React.useContext(ComboProductContext)

   return (
      <React.Fragment>
         {state.description || state.tags?.length ? (
            <StyledContainer>
               <StyledAction>
                  <IconButton type="outline" onClick={() => openTunnel(1)}>
                     <EditIcon />
                  </IconButton>
               </StyledAction>
               <StyledRow>
                  <TagGroup>
                     {state.tags.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
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
