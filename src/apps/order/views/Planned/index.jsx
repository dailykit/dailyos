import React from 'react'
import {
   Flex,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { Wrapper } from './styled'
import { useTabs } from '../../context'
import {
   InventorySection,
   ReadyToEatSection,
   MealKitSection,
   MealKitSachetSection,
} from './sections'

const Planned = () => {
   const { tab, addTab } = useTabs()
   const [mealKitTotal, setMealKitTotal] = React.useState(0)
   const [inventoryTotal, setInventoryTotal] = React.useState(0)
   const [readyToEatTotal, setReadyToEatTotal] = React.useState(0)
   const [mealKitSachetTotal, setMealKitSachetTotal] = React.useState(0)

   React.useEffect(() => {
      if (!tab) {
         addTab('Planned', '/apps/order/planned')
      }
   }, [tab, addTab])

   return (
      <Wrapper>
         <HorizontalTabs>
            <HorizontalTabList style={{ padding: '0 16px' }}>
               <HorizontalTab>Meal Kit ({mealKitTotal})</HorizontalTab>
               <HorizontalTab>Ready To Eat ({readyToEatTotal})</HorizontalTab>
               <HorizontalTab>Inventory ({inventoryTotal})</HorizontalTab>
               <HorizontalTab>
                  Meal Kit Sachets ({mealKitSachetTotal})
               </HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <MealKitSection setMealKitTotal={setMealKitTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <ReadyToEatSection setReadyToEatTotal={setReadyToEatTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <InventorySection setInventoryTotal={setInventoryTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <MealKitSachetSection
                     setMealKitSachetTotal={setMealKitSachetTotal}
                  />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}

export default Planned
