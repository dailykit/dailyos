import { IconButton, Tunnel, Tunnels, useTunnel, Text } from '@dailykit/ui'
import React from 'react'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import PackagingTypeTunnel from './PackagingTypeTunnel'

export default function Packagings() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <PackagingTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">Packagings</Text>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
         </StyledWrapper>
      </>
   )
}
