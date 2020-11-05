import React from 'react'
import {
   ButtonTile,
   IconButton,
   Tag,
   TagGroup,
   useTunnel,
   Tunnels,
   Tunnel,
   Text,
   Spacer,
   Flex,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { EditIcon } from '../../../../../../assets/icons'
import { StyledAction, StyledContainer, StyledRow } from './styled'
import { DescriptionTunnel } from '../../tunnels'
import { Tooltip } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.inventoryproduct.components.description.'

const Description = ({ state }) => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

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
                     <IconButton type="ghost" onClick={() => openTunnel(1)}>
                        <EditIcon color="#00A7E1" />
                     </IconButton>
                  </StyledAction>
                  <Flex container alignItems="center">
                     <Text as="subtitle">Tags</Text>
                     <Tooltip identifier="inventory_product_tags" />
                  </Flex>
                  <Spacer size="4px" />
                  {state.tags?.length ? (
                     <TagGroup>
                        {state.tags.map(tag => (
                           <Tag key={tag}>{tag}</Tag>
                        ))}
                     </TagGroup>
                  ) : (
                     <Text as="p">NA</Text>
                  )}
                  <Spacer size="16px" />
                  <Flex container alignItems="center">
                     <Text as="subtitle">Description</Text>
                     <Tooltip identifier="inventory_product_description" />
                  </Flex>
                  <Text as="p">{state.description || 'NA'}</Text>
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
