import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
   Text,
} from '@dailykit/ui'
import { DescriptionTunnel } from '../../tunnels'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import { StyledContainer, StyledRow } from './styled'

const Description = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {state.description ? (
            <StyledContainer>
               <Text as="title">Description</Text>
               <StyledRow>
                  <Text as="p">{state.description}</Text>
                  <IconButton type="outline" onClick={() => openTunnel(1)}>
                     <EditIcon />
                  </IconButton>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Description"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Description
