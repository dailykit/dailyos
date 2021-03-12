import React from 'react'
import {
   Flex,
   SectionTab as Tab,
   SectionTabs as Tabs,
   SectionTabList as TabList,
   SectionTabPanel as TabPanel,
   SectionTabPanels as TabPanels,
} from '@dailykit/ui'

import { Products } from './sections'
import { Container } from './styled'
import { useTabs } from '../../../../shared/providers'

const Planned = () => {
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Planned', '/order/planned')
      }
   }, [tab, addTab])
   return (
      <Container>
         <Tabs>
            <TabList>
               <Tab>
                  <Flex
                     container
                     height="40px"
                     alignItems="center"
                     justifyContent="center"
                  >
                     Products
                  </Flex>
               </Tab>
            </TabList>
            <TabPanels>
               <TabPanel>
                  <Products />
               </TabPanel>
            </TabPanels>
         </Tabs>
      </Container>
   )
}

export default Planned
