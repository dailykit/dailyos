import React from 'react'

// Components
import { IconButton, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'
import WorkOrderTypeTunnel from './WorkOrderTypeTunnel'

export default function WorkOrders() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <WorkOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <h1>Work Orders</h1>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
         </StyledWrapper>
      </>
   )
}
