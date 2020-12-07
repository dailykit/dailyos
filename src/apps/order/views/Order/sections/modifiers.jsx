import React from 'react'
import { isEmpty, uniqBy } from 'lodash'
import {
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { MealKits, Inventories, ReadyToEats } from '.'

const ProductModifiers = ({ product }) => {
   const [inventories, setInventories] = React.useState([])
   const [mealkits, setMealKits] = React.useState([])
   const [readytoeats, setReadyToEats] = React.useState([])

   React.useEffect(() => {
      if (product?.orderModifiers) {
         product.orderModifiers.forEach(node => {
            for (let [key, value] of Object.entries(node)) {
               if (Array.isArray(value) && !isEmpty(value)) {
                  if (key === 'inventoryProducts') {
                     setInventories(data => uniqBy([...value, ...data], 'id'))
                  }
                  if (key === 'mealKitProducts') {
                     setMealKits(data => uniqBy([...value, ...data], 'id'))
                  }
                  if (key === 'readyToEatProducts') {
                     setReadyToEats(data => uniqBy([...value, ...data], 'id'))
                  }
               }
            }
         })
      }
      return () => {
         setInventories([])
         setMealKits([])
         setReadyToEats([])
      }
   }, [product])

   return (
      <HorizontalTabs>
         <HorizontalTabList>
            {!isEmpty(mealkits) && (
               <HorizontalTab>Meal Kits ({mealkits.length})</HorizontalTab>
            )}
            {!isEmpty(inventories) && (
               <HorizontalTab>Inventories ({inventories.length})</HorizontalTab>
            )}
            {!isEmpty(readytoeats) && (
               <HorizontalTab>
                  Ready To Eats ({readytoeats.length})
               </HorizontalTab>
            )}
         </HorizontalTabList>
         <HorizontalTabPanels>
            {!isEmpty(mealkits) && (
               <HorizontalTabPanel>
                  <MealKits
                     data={{
                        mealkits,
                        error: null,
                        loading: false,
                     }}
                     hideModifiers
                  />
               </HorizontalTabPanel>
            )}
            {!isEmpty(inventories) && (
               <HorizontalTabPanel>
                  <Inventories
                     data={{
                        inventories,
                        error: null,
                        loading: false,
                     }}
                     hideModifiers
                  />
               </HorizontalTabPanel>
            )}
            {!isEmpty(readytoeats) && (
               <HorizontalTabPanel>
                  <ReadyToEats
                     data={{
                        readytoeats,
                        error: null,
                        loading: false,
                     }}
                     hideModifiers
                  />
               </HorizontalTabPanel>
            )}
         </HorizontalTabPanels>
      </HorizontalTabs>
   )
}

export default ProductModifiers
