import React from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import { ORDER } from '../../graphql'
import { Loader } from '../../components'
import { UserIcon, ArrowUpIcon, ArrowDownIcon } from '../../assets/icons'

import {
   Wrapper,
   Header,
   OrderItems,
   OrderItem,
   StyledCount,
   StyledProductTitle,
   StyledServings,
   List,
   ListHead,
   ListBody,
   ListBodyItem,
   Legend,
} from './styled'
import { useTranslation } from 'react-i18next'

const address = 'apps.order.views.order.'
const Order = () => {
   const { t } = useTranslation()
   const params = useParams()
   const [order, setOrder] = React.useState(null)
   const [currentProduct, setCurrentProduct] = React.useState(null)
   const { loading, error } = useSubscription(ORDER, {
      variables: {
         id: params.id,
      },
      onSubscriptionData: async ({ subscriptionData: { data } }) => {
         const {
            orderMealKitProducts,
            orderInventoryProducts,
            orderReadyToEatProducts,
            ...rest
         } = data.order
         await setOrder({
            ...rest,
            mealkits: orderMealKitProducts,
            inventories: orderInventoryProducts,
            readtoeats: orderReadyToEatProducts,
         })
         if (orderMealKitProducts.length > 0) {
            setCurrentProduct({
               id: orderMealKitProducts[0].id,
               type: 'Meal Kit',
            })
         } else if (orderInventoryProducts.length > 0) {
            setCurrentProduct({
               id: orderInventoryProducts[0].id,
               type: 'Inventory',
            })
         } else if (orderReadyToEatProducts.length > 0) {
            setCurrentProduct({
               id: orderReadyToEatProducts[0].id,
               type: 'Ready to Eat',
            })
         }
      },
   })

   if (loading || !order)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error) return <Wrapper>{t(address.concat('something went wrong!'))}</Wrapper>
   return (
      <Wrapper>
         <Header>
            <h3>{t(address.concat('order no'))}: ORD{order.id}</h3>
            <section>
               <section>
                  <span>{t(address.concat('ordered'))}</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>{t(address.concat('expected dispatch'))}</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>{t(address.concat('delivery'))}</span>
                  <span>Feb 12, 2020</span>
               </section>
            </section>
         </Header>
         <section>
            <StyledCount>
               0 /{' '}
               {order.inventories.length +
                  order.mealkits.length +
                  order.readtoeats.length}
               &nbsp;{t(address.concat('items'))}
            </StyledCount>
            <OrderItems>
               {order.inventories &&
                  order.inventories.map(inventory => (
                     <OrderItem
                        key={inventory.id}
                        onClick={() =>
                           setCurrentProduct({
                              id: inventory.id,
                              type: 'Inventory',
                           })
                        }
                        isActive={
                           currentProduct?.id === inventory.id &&
                           currentProduct?.type === 'Inventory'
                        }
                     >
                        <StyledProductTitle>
                           {inventory?.inventoryProduct?.name}
                           &nbsp;-&nbsp;
                           {inventory?.comboProduct?.name}(
                           {inventory?.comboProductComponent?.label})
                        </StyledProductTitle>
                        <section>
                           <span>
                              {inventory.assemblyStatus === 'ASSEMBLED' ? 1 : 0}{' '}
                              / 1
                           </span>
                           <StyledServings>
                              <span>
                                 <UserIcon size={16} color="#555B6E" />
                              </span>
                              <span>
                                 {inventory?.inventoryProductOption?.quantity}
                                 &nbsp;-&nbsp;
                                 {inventory?.inventoryProductOption?.label}
                              </span>
                           </StyledServings>
                        </section>
                     </OrderItem>
                  ))}
               {order.mealkits &&
                  order.mealkits.map(mealkit => (
                     <OrderItem
                        key={mealkit.id}
                        onClick={() =>
                           setCurrentProduct({
                              id: mealkit.id,
                              type: 'Meal Kit',
                           })
                        }
                        isActive={
                           currentProduct?.id === mealkit.id &&
                           currentProduct?.type === 'Meal Kit'
                        }
                     >
                        <div>
                           <StyledProductTitle>
                              {mealkit?.simpleRecipeProduct?.name}
                              &nbsp;-&nbsp;
                              {mealkit?.comboProduct?.name}(
                              {mealkit?.comboProductComponent?.label})
                           </StyledProductTitle>
                        </div>
                        <section>
                           <span>
                              {
                                 mealkit?.orderSachets.filter(
                                    sachet => sachet.isAssembled
                                 ).length
                              }
                              &nbsp;/&nbsp;
                              {
                                 mealkit?.orderSachets.filter(
                                    sachet => sachet.status === 'COMPLETED'
                                 ).length
                              }
                              &nbsp; / {mealkit?.orderSachets?.length}
                           </span>
                           <StyledServings>
                              <span>
                                 <UserIcon size={16} color="#555B6E" />
                              </span>
                              <span>
                                 {
                                    mealkit?.simpleRecipeProductOption
                                       ?.simpleRecipeYield?.yield?.serving
                                 }
                                 &nbsp; {t(address.concat('servings'))}
                              </span>
                           </StyledServings>
                        </section>
                     </OrderItem>
                  ))}
               {order.readytoeats &&
                  order.readytoeats.map(readytoeat => (
                     <OrderItem
                        key={readytoeat.id}
                        onClick={() =>
                           setCurrentProduct({
                              id: readytoeat.id,
                              type: 'Ready to Eat',
                           })
                        }
                        isActive={
                           currentProduct?.id === readytoeat.id &&
                           currentProduct?.type === 'Ready to Eat'
                        }
                     >
                        <div>
                           <StyledProductTitle>
                              {readytoeat?.comboProduct?.name}&nbsp;-&nbsp;
                              {readytoeat?.comboProduct?.name}(
                              {readytoeat?.comboProductComponent?.label})
                           </StyledProductTitle>
                        </div>
                        <section>
                           <span>
                              {readytoeat?.assemblyStatus === 'ASSEMBLED'
                                 ? 1
                                 : 0}{' '}
                              / 1
                           </span>
                           <StyledServings>
                              <span>
                                 <UserIcon size={16} color="#555B6E" />
                              </span>
                              <span>
                                 {
                                    readytoeat?.simpleRecipeProductOption
                                       ?.simpleRecipeYield?.yield?.serving
                                 }
                                 &nbsp; {t(address.concat('servings'))}
                              </span>
                           </StyledServings>
                        </section>
                     </OrderItem>
                  ))}
            </OrderItems>
         </section>
         <Legend>
            <h2>{t(address.concat('legends'))}</h2>
            <section>
               <span />
               <span>{t(address.concat('pending'))}</span>
            </section>
            <section>
               <span />
               <span>{t(address.concat('processing'))}</span>
            </section>
            <section>
               <span />
               <span>{t(address.concat('done'))}</span>
            </section>
         </Legend>
         {currentProduct?.type === 'Meal Kit' && (
            <ProductDetails
               product={order.mealkits.find(
                  ({ id }) => id === currentProduct?.id
               )}
            />
         )}
      </Wrapper>
   )
}

export default Order

const ProductDetails = ({ product }) => {
   const { t } = useTranslation()
   const [currentPanel, setCurrentPanel] = React.useState(null)
   React.useEffect(() => {
      if ('id' in product && product.orderSachets.length > 0) {
         setCurrentPanel(product?.orderSachets[0]?.id)
      }
   }, [product])
   return (
      <List>
         <ListHead>
            <span>{t(address.concat('ingredient'))}</span>
            <span>{t(address.concat('supplier item'))}</span>
            <span>{t(address.concat('processing'))}</span>
            <span>{t(address.concat('quantity'))}</span>
            <span />
         </ListHead>
         <ListBody>
            {product.orderSachets.map(item => (
               <ListBodyItem
                  key={item.id}
                  isOpen={currentPanel === item.id}
                  variant={{
                     isLabelled: item.isLabelled,
                     isPortioned: item.isPortioned,
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
                        onClick={() =>
                           setCurrentPanel(
                              currentPanel === item.id ? '' : item.id
                           )
                        }
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
                        <span>{t(address.concat('label template'))}</span>
                        <span>
                           {item?.labelUri ? (
                              <a href={item.labelUri} title="Label URI">
                                 {t(address.concat('link'))}
                              </a>
                           ) : (
                                 'N/A'
                              )}
                        </span>
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
