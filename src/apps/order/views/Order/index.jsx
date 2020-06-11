import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { useOrder } from '../../context'
import { ORDER } from '../../graphql'
import { Loader } from '../../components'
import { UserIcon } from '../../assets/icons'

import {
   Wrapper,
   Header,
   OrderItems,
   OrderItem,
   StyledCount,
   StyledProductTitle,
   StyledServings,
   Legend,
   StyledTabs,
   StyledTabList,
   StyledTab,
   StyledTabPanels,
   StyledTabPanel,
} from './styled'

import MealKitProductDetails from './MealKitProductDetails'

const address = 'apps.order.views.order.'
const Order = () => {
   const { t } = useTranslation()
   const params = useParams()
   const { switchView } = useOrder()
   const [order, setOrder] = React.useState(null)
   const [mealkits, setMealKits] = React.useState([])
   const [inventories, setInventories] = React.useState([])
   const [readytoeats, setReadyToEats] = React.useState([])

   const { loading, error } = useSubscription(ORDER, {
      variables: {
         id: params.id,
      },
      onSubscriptionData: async ({ subscriptionData: { data = {} } }) => {
         const {
            orderMealKitProducts,
            orderInventoryProducts,
            orderReadyToEatProducts,
            ...rest
         } = data.order
         setOrder(rest)

         setMealKits(orderMealKitProducts)
         setInventories(orderInventoryProducts)
         setReadyToEats(orderReadyToEatProducts)
      },
   })

   React.useEffect(() => {
      return () => switchView('SUMMARY')
   }, [])

   if (loading || !order)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error)
      return <Wrapper>{t(address.concat('something went wrong!'))}</Wrapper>
   return (
      <Wrapper>
         <Header>
            <h3>
               <span>{t(address.concat('order no'))}</span>: ORD{order.id}
            </h3>
            <section>
               <section>
                  <span>{t(address.concat('ordered'))}:&nbsp;</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>{t(address.concat('expected dispatch'))}:&nbsp;</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>{t(address.concat('delivery'))}:&nbsp;</span>
                  <span>Feb 12, 2020</span>
               </section>
            </section>
         </Header>
         <section>
            <StyledCount>
               0 / {inventories.length + mealkits.length + readytoeats.length}
               &nbsp;{t(address.concat('items'))}
            </StyledCount>
            <StyledTabs>
               <StyledTabList>
                  <StyledTab>Meal Kits ({mealkits.length})</StyledTab>
                  <StyledTab>Inventories ({inventories.length})</StyledTab>
                  <StyledTab>Ready To Eats ({readytoeats.length})</StyledTab>
               </StyledTabList>
               <StyledTabPanels>
                  <StyledTabPanel>
                     <MealKits mealkits={mealkits} />
                  </StyledTabPanel>
                  <StyledTabPanel>
                     <Inventories inventories={inventories} />
                  </StyledTabPanel>
                  <StyledTabPanel>
                     <ReadyToEats readytoeats={readytoeats} />
                  </StyledTabPanel>
               </StyledTabPanels>
            </StyledTabs>
         </section>
      </Wrapper>
   )
}

export default Order

const MealKits = ({ mealkits }) => {
   const { t } = useTranslation()
   const { selectMealKit, switchView } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const selectProduct = id => {
      setCurrent(id)
      const product = mealkits.find(mealkit => id === mealkit.id)
      if (product.orderSachets.length > 0) {
         selectMealKit(
            product.orderSachets[0].id,
            product.simpleRecipeProduct.name
         )
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (mealkits.length > 0) {
         const [product] = mealkits
         selectProduct(product.id)
      }
   }, [mealkits])

   if (mealkits.length === 0) return <div>No mealkit products!</div>
   return (
      <>
         <OrderItems>
            {mealkits.map(mealkit => (
               <OrderItem
                  key={mealkit.id}
                  isActive={current === mealkit.id}
                  onClick={() => selectProduct(mealkit.id)}
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
                              sachet => sachet.status === 'PACKED'
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
         </OrderItems>
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
         {current && (
            <MealKitProductDetails
               product={mealkits.find(({ id }) => id === current)}
            />
         )}
      </>
   )
}

const Inventories = ({ inventories }) => {
   const { switchView, selectInventory } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const selectProduct = id => {
      setCurrent(id)
      const product = inventories.find(mealkit => id === mealkit.id)
      if ('id' in product) {
         selectInventory(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (inventories.length > 0) {
         const [product] = inventories
         setCurrent(product.id)
      }
   }, [inventories])

   if (inventories.length === 0) return <div>No inventories products!</div>
   return (
      <OrderItems>
         {inventories.map(inventory => (
            <OrderItem
               key={inventory.id}
               isActive={current === inventory.id}
               onClick={() => selectProduct(inventory.id)}
            >
               <StyledProductTitle>
                  {inventory?.inventoryProduct?.name}
                  &nbsp;-&nbsp;
                  {inventory?.comboProduct?.name}(
                  {inventory?.comboProductComponent?.label})
               </StyledProductTitle>
               <section>
                  <span>
                     {inventory.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
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
      </OrderItems>
   )
}

const ReadyToEats = ({ readytoeats }) => {
   const { t } = useTranslation()
   const { switchView, selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const selectProduct = id => {
      setCurrent(id)
      const product = readytoeats.find(mealkit => id === mealkit.id)
      if ('id' in product) {
         selectReadyToEat(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (readytoeats.length > 0) {
         const [product] = readytoeats
         setCurrent(product.id)
      }
   }, [readytoeats])

   if (readytoeats.length === 0) return <div>No ready to eat products!</div>
   return (
      <OrderItems>
         {readytoeats.map(readytoeat => (
            <OrderItem
               key={readytoeat.id}
               onClick={() => selectProduct(readytoeat.id)}
               isActive={current === readytoeat.id}
            >
               <div>
                  <StyledProductTitle>
                     {readytoeat?.comboProduct?.name}
                     &nbsp;(
                     {readytoeat?.comboProductComponent?.label})
                  </StyledProductTitle>
               </div>
               <section>
                  <span>
                     {readytoeat?.assemblyStatus === 'ASSEMBLED' ? 1 : 0} / 1
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
   )
}
