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
import { InventorySection } from './sections'
import { Flex } from '../../../../shared/components'

const Planned = () => {
   const { tab, addTab } = useTabs()
   const [inventoryTotal, setInventoryTotal] = React.useState(0)

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
               </HorizontalTabList>
            </Flex>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <InventorySection setInventoryTotal={setInventoryTotal} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}

export default Planned
