import React from 'react'
import { useTranslation } from 'react-i18next'

import { useOrder } from '../../context'
import { ArrowUpIcon, ArrowDownIcon } from '../../assets/icons'
import { List, ListHead, ListBody, ListBodyItem } from './styled'

const address = 'apps.order.views.order.'

const ProductDetails = ({ product }) => {
   const { selectMealKit } = useOrder()
   const { t } = useTranslation()
   const [currentPanel, setCurrentPanel] = React.useState(null)
   React.useEffect(() => {
      if ('id' in product && product.orderSachets.length > 0) {
         setCurrentPanel(product?.orderSachets[0]?.id)
      }
   }, [product])

   const selectSachet = id => {
      selectMealKit(id, product.simpleRecipeProduct.name)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   return (
      <List>
         <ListHead>
            <span>{t(address.concat('ingredients'))}</span>
            <span>{t(address.concat('supplier item'))}</span>
            <span>{t(address.concat('processing'))}</span>
            <span>{t(address.concat('quantity'))}</span>
            <span />
         </ListHead>
         <ListBody>
            {product.orderSachets.map(item => (
               <ListBodyItem
                  key={item.id}
                  onClick={() => selectSachet(item.id)}
                  isOpen={currentPanel === item.id}
                  variant={{
                     isAssembled: item.isAssembled,
                     isPacked: item.status === 'PACKED',
                  }}
               >
                  <header>
                     <span>{item.ingredientName}</span>
                     <span>
                        {(item.bulkItemId &&
                           item?.bulkItem?.supplierItem?.name) ||
                           ''}
                        {(item.sachetItemId &&
                           item?.sachetItem?.bulkItem?.supplierItem?.name) ||
                           ''}
                        {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
                     </span>
                     <span>{item.processingName}</span>
                     <span>{item.quantity}</span>
                     <button
                        type="button"
                        onClick={() => selectSachet(item.id)}
                     >
                        {currentPanel === item.id ? (
                           <ArrowDownIcon />
                        ) : (
                           <ArrowUpIcon />
                        )}
                     </button>
                  </header>
                  <main>
                     <section>
                        <span>{t(address.concat('sachet id'))}</span>
                        <span>{item.id}</span>
                     </section>
                     <section>
                        <span>{t(address.concat('packaging name'))}</span>
                        <span>{item?.packaging?.name || 'N/A'}</span>
                     </section>
                     <section>
                        <span>SOP</span>
                        <span>
                           {(item.bulkItemId && item?.bulkItem?.sop) || ''}
                           {(item.sachetItemId &&
                              item?.sachetItem?.bulkItem?.sop) ||
                              ''}
                           {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
                        </span>
                     </section>
                     <section>
                        <span>{t(address.concat('bulk density'))}</span>
                        <span>
                           {(item.bulkItemId && item?.bulkItem?.bulkDensity) ||
                              ''}
                           {(item.sachetItemId &&
                              item?.sachetItem?.bulkItem?.bulkDensity) ||
                              ''}
                           {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
                        </span>
                     </section>
                     <section>
                        <span>{t(address.concat('shelf life'))}</span>
                        <span>
                           {item.bulkItemId && item?.bulkItem?.shelfLife
                              ? `${item?.bulkItem?.shelfLife.value} ${item?.bulkItem?.shelfLife.unit}`
                              : ''}
                           {item.sachetItemId &&
                           item?.sachetItem?.bulkItem?.shelfLife
                              ? `${item?.sachetItem?.bulkItem?.shelfLife.value} ${item?.sachetItem?.bulkItem?.shelfLife.unit}`
                              : ''}
                           {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
                        </span>
                     </section>
                     <section>
                        <span>{t(address.concat('yield'))}</span>
                        <span>
                           {(item.bulkItemId && item?.bulkItem?.yield?.value) ||
                              ''}
                           {(item.sachetItemId &&
                              item?.sachetItem?.bulkItem?.yield?.value) ||
                              ''}
                           {!item?.bulkItemId && !item?.sachetItemId && 'NA'}
                        </span>
                     </section>
                  </main>
               </ListBodyItem>
            ))}
         </ListBody>
      </List>
   )
}

export default ProductDetails
