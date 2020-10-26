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
   Tunnels,
   Flex,
} from '@dailykit/ui'

import { InformationGrid } from './InformationGrid'
import { FAQs } from './FAQs'
import { InformationList } from './InformationList'
import { Tooltip } from '../../../../../shared/components'
import { StyledWrapper } from '../styled'

export const Blocks = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <Flex maxWidth="1280px" width="calc(100vw - 64px)" margin="0 auto">
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container alignItems="center">
               <Text as="h2">Blocks</Text>
               <Tooltip identifier="blocks_list_heading" />
            </Flex>
            <IconButton type="solid" onClick={() => openTunnel(1)}>
               <PlusIcon />
            </IconButton>
         </Flex>
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
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <InformationList closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </Flex>
   )
}
