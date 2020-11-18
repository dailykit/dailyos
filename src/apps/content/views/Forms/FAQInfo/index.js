import React, { useEffect } from 'react'
import {
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTab,
   Text,
   Spacer,
   Flex,
} from '@dailykit/ui'
import { useTabs } from '../../../context'
import { useLocation } from 'react-router-dom'
import { Tooltip } from '../../../../../shared/components'
import AddFAQ from './AddFAQ'
import InformationBlock from './InformationBlock'

export default function BlockForm() {
   const { tab, addTab } = useTabs()
   const location = useLocation()

   useEffect(() => {
      if (!tab) {
         addTab('FAQ Form', location.pathname)
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
               <Text as="h2">FAQ Form</Text>
               <Tooltip identifier="blocks_list_heading" />
            </Flex>
         </Flex>
         <Spacer size="20px" />
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>Form Details</HorizontalTab>
               <HorizontalTab>Information Block Table</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <AddFAQ />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <InformationBlock />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Flex>
   )
}
