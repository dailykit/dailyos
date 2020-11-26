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
         product.orderModifiers.map(node => {
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
   }, [product])

   return (
      <HorizontalTabs>
         <HorizontalTabList>
            <HorizontalTab>Meal Kits ({mealkits.length})</HorizontalTab>
            <HorizontalTab>Inventories ({inventories.length})</HorizontalTab>
            <HorizontalTab>Ready To Eats ({readytoeats.length})</HorizontalTab>
         </HorizontalTabList>
         <HorizontalTabPanels>
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
         </HorizontalTabPanels>
      </HorizontalTabs>
   )
}

export default ProductModifiers