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
} from './styled'

const sachets = [
   {
      id: 1,
      quantity: '400gm',
      isLabelled: true,
      isPortioned: true,
      ingredientName: 'Onion',
      supplierItem: 'Chillies',
      processingName: 'Finely Sliced',
      data: { text: 'Onion by Chillies' },
   },
   {
      id: 2,
      quantity: '300gm',
      isLabelled: false,
      isPortioned: true,
      ingredientName: 'Potato',
      supplierItem: 'Potato Bois',
      processingName: 'Chopped',
      data: { text: 'Potato by Potato Bois' },
   },
   {
      id: 3,
      quantity: '200gm',
      isLabelled: false,
      isPortioned: false,
      ingredientName: 'Tomato',
      supplierItem: 'Tometo',
      processingName: 'Sliced',
      data: { text: 'Tomato by Tometo' },
   },
]

const Order = () => {
   const params = useParams()
   const [order, setOrder] = React.useState(null)
   const [currentPanel, setCurrentPanel] = React.useState(null)
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
         setOrder({
            ...rest,
            mealkits: orderMealKitProducts,
            inventories: orderInventoryProducts,
            readtoeats: orderReadyToEatProducts,
         })
      },
   })

   if (loading || !order)
      return (
         <Wrapper>
            <Loader />
         </Wrapper>
      )
   if (error) return <Wrapper>Something went wrong!</Wrapper>
   return (
      <Wrapper>
         <Header>
            <h3>Order no.: ORD{order.id}</h3>
            <section>
               <section>
                  <span>Ordered</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>Expected dispatch</span>
                  <span>Feb 12, 2020</span>
               </section>
               <section>
                  <span>Delivery</span>
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
               &nbsp;items
            </StyledCount>
            <OrderItems>
               {order.inventories &&
                  order.inventories.map(inventory => (
                     <OrderItem key={inventory.id}>
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
               {order.mealkits.map(mealkit => (
                  <OrderItem key={mealkit.id}>
                     <div>
                        <StyledProductTitle>
                           {mealkit?.simpleRecipeProduct?.name}
                           &nbsp;-&nbsp;
                           {mealkit?.comboProduct?.name}(
                           {mealkit?.comboProductComponent?.label})
                        </StyledProductTitle>
                     </div>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              mealkit?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; Servings
                        </span>
                     </StyledServings>
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
                  </OrderItem>
               ))}
               {order.readtoeats.map(readytoeat => (
                  <OrderItem key={readytoeat.id}>
                     <div>
                        <StyledProductTitle>
                           {readytoeat?.comboProduct?.name}&nbsp;-&nbsp;
                           {readytoeat?.comboProduct?.name}(
                           {readytoeat?.comboProductComponent?.label})
                        </StyledProductTitle>
                     </div>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              readytoeat?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; Servings
                        </span>
                     </StyledServings>
                     <span>
                        {readytoeat?.assemblyStatus === 'ASSEMBLED' ? 1 : 0} / 1
                     </span>
                  </OrderItem>
               ))}
            </OrderItems>
         </section>
         <List>
            <ListHead>
               <span>Ingredient</span>
               <span>Supplier Item</span>
               <span>Processing</span>
               <span>Quantity</span>
               <span />
            </ListHead>
            <ListBody>
               {sachets.map(item => (
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
                        <span>{item.supplierItem}</span>
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
                        <h1>{item.data.text}</h1>
                     </main>
                  </ListBodyItem>
               ))}
            </ListBody>
         </List>
      </Wrapper>
   )
}

export default Order
