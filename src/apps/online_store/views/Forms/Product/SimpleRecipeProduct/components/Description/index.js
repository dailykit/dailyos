import React from 'react'
import { ButtonTile, IconButton, Tag, TagGroup } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { EditIcon } from '../../../../../../assets/icons'
import { StyledAction, StyledContainer, StyledRow } from './styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.description.'

const Description = ({ state, openTunnel }) => {
   const { t } = useTranslation()

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
               text={t(address.concat('add description'))}
               onClick={() => openTunnel(1)}
            />
         )}
      </React.Fragment>
   )
}

export default Description
