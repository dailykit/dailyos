import React from 'react'

import {
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTab,
   Text,
   Spacer,
   IconButton,
   PlusIcon,
   useTunnel,
   Tunnel,
   Tunnels
} from '@dailykit/ui'

import { InformationGrid } from './InformationGrid'
import { FAQs } from './FAQs'
import {InformationList} from './InformationList'

import { StyledWrapper,StyledHeader } from '../styled'

export const Blocks = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <>
      <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <InformationList closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      <StyledWrapper>
         <div>
            <Spacer size="20px" />
            <StyledHeader>
            <Text as="h1">Blocks</Text>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <PlusIcon/>
               </IconButton>
            </StyledHeader>
            <Spacer size="20px" />
            <HorizontalTabs>
               <HorizontalTabList>
                  <HorizontalTab>Information Grid</HorizontalTab>
                  <HorizontalTab>FAQS</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <InformationGrid />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <FAQs />
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </div>
      </StyledWrapper>
      </>
   )
}
