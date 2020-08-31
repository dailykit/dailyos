import React from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../styled'
import { PLANNED } from '../../../graphql'
import {
   Wrapper,
   Labels,
   Label,
   List,
   ListHead,
   ListBody,
   StyledButton,
   ListBodyItem,
} from './styled'
import { NewTabIcon } from '../../../assets/icons'
import { useOrder, useTabs } from '../../../context'
import { Flex, InlineLoader } from '../../../../../shared/components'

export const ReadyToEatProduct = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState({})
   const [currentPanel, setCurrentPanel] = React.useState(null)
   const { loading, data: { simpleRecipeProduct = {} } = {} } = useSubscription(
      PLANNED.READY_TO_EAT_PRODUCT,
      {
         variables: {
            id: params.id,
            order: state.orders.where,
         },
         onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
            const { options } = data?.simpleRecipeProduct
            if (options.length > 0) {
               const [option] = options
               setCurrent(option)
            }
         },
      }
   )

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(
            simpleRecipeProduct?.name,
            `/apps/order/planned/ready-to-eat/${params.id}`
         )
      }
   }, [tab, loading])

   const selectOption = id => {
      selectReadyToEat(id)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   const openOrder = (e, id) => {
      e.stopPropagation()
      addTab(`ORD${id}`, `/apps/order/orders/${id}`)
   }

   if (loading) return <InlineLoader />
   return (
      <Wrapper>
         <Flex container alignItems="center">
            <h2 title={simpleRecipeProduct.name}>{simpleRecipeProduct.name}</h2>
            <h3 title={simpleRecipeProduct.products.aggregate.count}>
               <label>Total:</label>{' '}
               {simpleRecipeProduct.products.aggregate.count}
            </h3>
            <h3 title={simpleRecipeProduct.products.aggregate.sum.quantity}>
               <label>Quantity:</label>{' '}
               {simpleRecipeProduct.products.aggregate.sum.quantity}
            </h3>
         </Flex>
         <Spacer size="16px" />
         {simpleRecipeProduct.options.length > 0 ? (
            <>
               <Labels>
                  {simpleRecipeProduct.options.map(option => (
                     <Label
                        key={option.id}
                        onClick={() => setCurrent(option)}
                        isActive={current?.id === option.id}
                     >
                        <h3>{option.yield.size} Servings</h3>
                        <section>
                           {
                              option.orderReadyToEatProducts.nodes.filter(
                                 node => node.isAssembled
                              ).length
                           }
                           &nbsp;/&nbsp;
                           {option.orderReadyToEatProducts.aggregate.total}
                        </section>
                     </Label>
                  ))}
               </Labels>
               <Spacer size="8px" />
               {Object.keys(current).length > 0 && (
                  <List>
                     <ListHead>
                        <span>Order Id</span>
                        <span>Quantity</span>
                     </ListHead>
                     {current.orderReadyToEatProducts.nodes.length > 0 ? (
                        <ListBody>
                           {current.orderReadyToEatProducts.nodes.map(node => (
                              <ListBodyItem
                                 key={node.id}
                                 isAssembled={node.isAssembled}
                                 isOpen={currentPanel === node.id}
                                 onClick={() => selectOption(node.id)}
                              >
                                 <header>
                                    <span>
                                       <StyledButton
                                          type="button"
                                          onClick={e =>
                                             openOrder(e, node.orderId)
                                          }
                                       >
                                          ORD{node.orderId}
                                          <NewTabIcon size={14} />
                                       </StyledButton>
                                    </span>
                                    <span>{node.quantity}</span>
                                 </header>
                              </ListBodyItem>
                           ))}
                        </ListBody>
                     ) : (
                        <span>No products</span>
                     )}
                  </List>
               )}
            </>
         ) : (
            <span>No product options</span>
         )}
      </Wrapper>
   )
}
