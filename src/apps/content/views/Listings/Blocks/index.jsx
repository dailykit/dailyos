import React, { useEffect } from 'react'
import {
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTab,
   Text,
   Spacer,
   PlusIcon,
   useTunnel,
   Tunnel,
   Tunnels,
   Flex,
   ComboButton,
} from '@dailykit/ui'
import { useTabs } from '../../../context'
import { useLocation } from 'react-router-dom'
import { InformationGrid } from './Grid'
import { FAQs } from './FAQs'
import { BlockTunnel } from './Tunnel/BlockTunnel'
import { Tooltip } from '../../../../../shared/components'

export const Blocks = () => {
   const { tab, addTab } = useTabs()
   const location = useLocation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   useEffect(() => {
      if (!tab) {
         addTab('Information Block', location.pathname)
      }
   }, [addTab, tab])

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
            <ComboButton type="solid" onClick={() => openTunnel(1)}>
               <PlusIcon />
               Add Block
            </ComboButton>
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
               <BlockTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </Flex>
   )
}
