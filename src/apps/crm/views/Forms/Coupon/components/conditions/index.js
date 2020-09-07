import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
   Text,
} from '@dailykit/ui'
import { ConditionsTunnel } from '../../tunnels'
import { EditIcon } from '../../../../../../../shared/assets/icons'
import { StyledContainer, StyledRow } from './styled'

const Conditions = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ConditionsTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {state.condition ? (
            <StyledContainer>
               <Text as="title">Description</Text>
               <StyledRow>
                  <Text as="p">{state.condition}</Text>
                  <IconButton type="outline" onClick={() => openTunnel(1)}>
                     <EditIcon />
                  </IconButton>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Coupon's Condition"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Conditions
