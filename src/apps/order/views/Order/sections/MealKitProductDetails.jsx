import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Text, Flex, Filler } from '@dailykit/ui'

import { List } from '../styled'
import { useOrder } from '../../../context'
import { Tooltip } from '../../../../../shared/components'
import { ArrowUpIcon, ArrowDownIcon } from '../../../assets/icons'

const address = 'apps.order.views.order.'

const ProductDetails = ({ product }) => {
   const { t } = useTranslation()

   return (
      <>
         <List.Head>
            <Flex container alignItems="center">
               <span>{t(address.concat('ingredients'))}</span>
               <Tooltip identifier="order_details_mealkit_column_ingredient" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('supplier item'))}</span>
               <Tooltip identifier="order_details_mealkit_column_supplier_item" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('processing'))}</span>
               <Tooltip identifier="order_details_mealkit_column_processing" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('quantity'))}</span>
               <Tooltip identifier="order_details_mealkit_column_quantity" />
            </Flex>
         </List.Head>
         <List.Body>
            {!isEmpty(product?.orderSachets) ? (
               product?.orderSachets?.map(item => (
                  <SachetItem item={item} key={item.id} product={product} />
               ))
            ) : (
               <Filler message="There are no sachets linked to this product." />
            )}
         </List.Body>
      </>
   )
}

export default ProductDetails

const SachetItem = ({ item, product }) => {
   const { t } = useTranslation()
   const { selectMealKit } = useOrder()
   const [currentPanel, setCurrentPanel] = React.useState(null)

   const selectSachet = id => {
      selectMealKit(id, product.simpleRecipeProduct.name)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   return (
      <List.Item
         key={item.id}
         onClick={() => selectSachet(item.id)}
         isOpen={currentPanel === item.id}
         variant={{
            isAssembled: item.isAssembled,
            isPacked: item.status === 'PACKED',
         }}
      >
         <header>
            <span>{item.ingredientName || 'N/A'}</span>
            <span>
               {(item.bulkItemId && item?.bulkItem?.supplierItem?.name) || ''}
               {(item.sachetItemId &&
                  item?.sachetItem?.bulkItem?.supplierItem?.name) ||
                  ''}
               {!item?.bulkItemId && !item?.sachetItemId && 'N/A'}
            </span>
            <span>{item.processingName || 'N/A'}</span>
            <span>
               {item.quantity ? `${item.quantity}${item.unit}` : 'N/A'}
            </span>
            <button type="button" onClick={() => selectSachet(item.id)}>
               {currentPanel === item.id ? <ArrowDownIcon /> : <ArrowUpIcon />}
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
