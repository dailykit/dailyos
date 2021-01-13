import React from 'react'
import { Text, Flex } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'

import { List } from '../styled'
import { useOrder } from '../../../context'
import { Tooltip } from '../../../../../shared/components'
import { ArrowUpIcon, ArrowDownIcon } from '../../../assets/icons'

const address = 'apps.order.views.order.'
export const SachetItem = ({ item, product }) => {
   const { t } = useTranslation()
   const { state, selectSachet } = useOrder()
   const [isOpen, setIsOpen] = React.useState(null)

   React.useEffect(() => {
      if (state.sachet?.id) {
         setIsOpen(state.sachet?.id)
      }
   }, [state.sachet])

   const select = id => {
      selectSachet(id, { name: product?.simpleRecipeProduct?.name })
      setIsOpen(isOpen === id ? '' : id)
   }

   return (
      <List.Item
         key={item.id}
         onClick={() => select(item.id)}
         isOpen={isOpen === item.id}
         variant={{
            isAssembled: item.isAssembled,
            isPacked: item.status === 'PACKED',
         }}
      >
         <header>
            <span title={item.ingredientName || 'N/A'}>
               {item.orderModifierId && <List.Badge>MODIFIER</List.Badge>}
               {item.ingredientName || 'N/A'}
            </span>
            <span>
               {(item.bulkItemId && item?.bulkItem?.supplierItem?.name) || ''}
               {(item.sachetItemId &&
                  item?.sachetItem?.bulkItem?.supplierItem?.name) ||
                  ''}
               {!item?.bulkItemId && !item?.sachetItemId && 'N/A'}
            </span>
            <span title={item.processingName || 'N/A'}>
               {item.processingName || 'N/A'}
            </span>
            <span
               title={item.quantity ? `${item.quantity}${item.unit}` : 'N/A'}
            >
               {item.quantity ? `${item.quantity}${item.unit}` : 'N/A'}
            </span>
            <button type="button" onClick={() => select(item.id)}>
               {isOpen === item.id ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </button>
         </header>
         <main>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">{t(address.concat('sachet id'))}</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_id" />
               </Flex>
               <Text as="h3">{item.id}</Text>
            </section>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">{t(address.concat('packaging name'))}</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_packaging" />
               </Flex>
               <Text as="h3">{item?.packaging?.name || 'N/A'}</Text>
            </section>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">SOP</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_sop" />
               </Flex>
               <Text as="h3">
                  {(item.bulkItemId && item?.bulkItem?.sop) || ''}
                  {(item.sachetItemId && item?.sachetItem?.bulkItem?.sop) || ''}
                  {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
               </Text>
            </section>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">{t(address.concat('bulk density'))}</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_bulk_density" />
               </Flex>
               <Text as="h3">
                  {(item.bulkItemId && item?.bulkItem?.bulkDensity) || ''}
                  {(item.sachetItemId &&
                     item?.sachetItem?.bulkItem?.bulkDensity) ||
                     ''}
                  {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
               </Text>
            </section>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">{t(address.concat('shelf life'))}</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_shelf_life" />
               </Flex>
               <Text as="h3">
                  {item.bulkItemId && item?.bulkItem?.shelfLife
                     ? `${item?.bulkItem?.shelfLife.value} ${item?.bulkItem?.shelfLife.unit}`
                     : ''}
                  {item.sachetItemId && item?.sachetItem?.bulkItem?.shelfLife
                     ? `${item?.sachetItem?.bulkItem?.shelfLife.value} ${item?.sachetItem?.bulkItem?.shelfLife.unit}`
                     : ''}
                  {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
               </Text>
            </section>
            <section>
               <Flex container alignItems="center">
                  <Text as="p">{t(address.concat('yield'))}</Text>
                  <Tooltip identifier="order_details_mealkit_sachet_column_yield" />
               </Flex>
               <Text as="h3">
                  {(item.bulkItemId && item?.bulkItem?.yield?.value) || ''}
                  {(item.sachetItemId &&
                     item?.sachetItem?.bulkItem?.yield?.value) ||
                     ''}
                  {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
               </Text>
            </section>
         </main>
      </List.Item>
   )
}
