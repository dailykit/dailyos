import React from 'react'
import {
   ButtonTile,
   IconButton,
   Tag,
   TagGroup,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { EditIcon } from '../../../../../../assets/icons'
import { StyledAction, StyledContainer, StyledRow } from './styled'
import { DescriptionTunnel } from '../../../SimpleRecipeProduct/tunnels'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.description.'

const Description = ({ state }) => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <>
            {state.description || state.tags?.length ? (
               <StyledContainer>
                  <StyledAction>
                     <IconButton type="outline" onClick={() => openTunnel(1)}>
                        <EditIcon />
                     </IconButton>
                  </StyledAction>
                  <StyledRow>
                     <TagGroup>
                        {state.tags.map(tag => (
                           <Tag key={tag}>{tag}</Tag>
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
         </>
      </>
   )
}

export default Description
