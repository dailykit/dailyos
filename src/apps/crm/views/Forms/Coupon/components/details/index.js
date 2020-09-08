import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
   Text,
} from '@dailykit/ui'
import { DetailsTunnel, DescriptionTunnel, TitleTunnel } from '../../tunnels'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import { StyledContainer, StyledRow } from '../styled'

const Description = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DetailsTunnel state={state} close={() => closeTunnel(1)} />
            </Tunnel>
            <Tunnel layer={2}>
               <TitleTunnel state={state} close={() => closeTunnel(2)} />
            </Tunnel>
            <Tunnel layer={3}>
               <DescriptionTunnel state={state} close={() => closeTunnel(3)} />
            </Tunnel>
         </Tunnels>
         {state?.metaDetails?.title || state?.metaDetails?.description ? (
            <>
               <StyledContainer>
                  <Text as="title">Title</Text>
                  <StyledRow>
                     <Text as="p">{state?.metaDetails?.title}</Text>
                     <IconButton type="outline" onClick={() => openTunnel(2)}>
                        <EditIcon />
                     </IconButton>
                  </StyledRow>
               </StyledContainer>
               <StyledContainer>
                  <Text as="title">Description</Text>
                  <StyledRow>
                     <Text as="p">{state?.metaDetails?.description}</Text>
                     <IconButton type="outline" onClick={() => openTunnel(3)}>
                        <EditIcon />
                     </IconButton>
                  </StyledRow>
               </StyledContainer>
            </>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Details"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Description
