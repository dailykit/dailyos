import React from 'react'
import {
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { Wrapper } from './styled'
import { useTabs } from '../../context'
import { Flex } from '../../../../shared/components'
import { InventorySection, ReadyToEatSection } from './sections'

const Planned = () => {
   const { tab, addTab } = useTabs()
   const [inventoryTotal, setInventoryTotal] = React.useState(0)
   const [readyToEatTotal, setReadyToEatTotal] = React.useState(0)

   React.useEffect(() => {
      if (!tab) {
         addTab('Planned', '/apps/order/planned')
      }
   }, [tab])

   return (
      <Wrapper>
         <HorizontalTabs>
            <Flex container padding="0 16px">
               <HorizontalTabList>
                  <HorizontalTab>Inventory ({inventoryTotal})</HorizontalTab>
                  <HorizontalTab>
                     Ready To Eat ({readyToEatTotal})
                  </HorizontalTab>
               </HorizontalTabList>
            </Flex>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <InventorySection setInventoryTotal={setInventoryTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <ReadyToEatSection setReadyToEatTotal={setReadyToEatTotal} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}

export default Planned
