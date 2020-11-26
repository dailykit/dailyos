import React from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Filler, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { QUERIES } from '../../../graphql'
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
import { logger } from '../../../../../shared/utils'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../shared/components'

export const ReadyToEatProduct = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState({})
   const [currentPanel, setCurrentPanel] = React.useState(null)
   const {
      error,
      loading,
      data: { simpleRecipeProduct = {} } = {},
   } = useSubscription(QUERIES.PLANNED.PRODUCTS.READY_TO_EAT.ONE, {
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
   })

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(
            simpleRecipeProduct?.name,
            `/apps/order/planned/ready-to-eat/${params.id}`
         )
      }
   }, [tab, loading, addTab, simpleRecipeProduct, params.id])

   const selectOption = id => {
      selectReadyToEat(id)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   const openOrder = (e, id) => {
      e.stopPropagation()
      addTab(`ORD${id}`, `/apps/order/orders/${id}`)
   }

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch ready to eat item details!')
      return <ErrorState message="Failed to fetch ready to eat item details!" />
   }
   return (
      <Wrapper>
         <Flex container alignItems="center">
            <h2 title={simpleRecipeProduct.name}>{simpleRecipeProduct.name}</h2>
            <Flex container width="180px" alignItems="center">
               <span title={simpleRecipeProduct.products.aggregate.count}>
                  Total
               </span>
               <Tooltip identifier="app_order_planned_ready_to_eat_item_details_total" />
               : {simpleRecipeProduct.products.aggregate.count}
            </Flex>
            <Flex container width="180px" alignItems="center">
               <span
                  title={simpleRecipeProduct.products.aggregate.sum.quantity}
               >
                  Quantity
               </span>
               <Tooltip identifier="app_order_planned_ready_to_eat_item_details_quantity" />
               : {simpleRecipeProduct.products.aggregate.sum.quantity}
            </Flex>
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
            <Filler message="No product options" />
         )}
      </Wrapper>
   )
}
