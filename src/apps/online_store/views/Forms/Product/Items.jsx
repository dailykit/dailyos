import React from 'react'
import { Text } from '@dailykit/ui'

import { ProductContext } from '../../../context/product/index'

import Item from './Item'
import { TabContainer, ItemTab } from './styled'

export default function Items({ open }) {
   const { productState, productDispatch } = React.useContext(ProductContext)

   React.useEffect(() => {
      productDispatch({ type: 'SET_ITEM_VIEW', payload: productState.items[0] })
   }, [])

   return (
      <>
         <TabContainer>
            {productState.items.map(item => {
               return (
                  <ItemTab
                     key={item.id}
                     active={productState.itemView?.id === item.id}
                     onClick={() => {
                        productDispatch({
                           type: 'SET_ITEM_VIEW',
                           payload: item,
                        })
                        productDispatch({
                           type: 'SET_CURRENT_RECIPE',
                           payload: {},
                        })
                     }}
                  >
                     <Text as="title">{item.label}</Text>
                  </ItemTab>
               )
            })}
         </TabContainer>
         <Item open={open} />
      </>
   )
}
