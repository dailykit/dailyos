import React from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Filler, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { QUERIES } from '../../../graphql'
import { NewTabIcon } from '../../../assets/icons'
import { useOrder, useTabs } from '../../../context'
import { logger } from '../../../../../shared/utils'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../shared/components'
import {
   List,
   Label,
   Labels,
   Wrapper,
   ListHead,
   ListBody,
   StyledButton,
   ListBodyItem,
} from './styled'

export const InventoryProduct = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, selectInventory } = useOrder()
   const [current, setCurrent] = React.useState({})
   const [currentPanel, setCurrentPanel] = React.useState(null)
   const {
      error,
      loading,
      data: { inventoryProduct = {} } = {},
   } = useSubscription(QUERIES.PLANNED.PRODUCTS.INVENTORY.ONE, {
      variables: {
         id: params.id,
         order: state.orders.where,
      },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const { options } = data.inventoryProduct
         if (options.length > 0) {
            const [option] = options
            setCurrent(option)
         }
      },
   })

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(
            inventoryProduct?.name,
            `/apps/order/planned/inventory/${params.id}`
         )
      }
   }, [tab, loading, addTab, inventoryProduct, params.id])

   const selectOption = id => {
      selectInventory(id)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   const openOrder = (e, id) => {
      e.stopPropagation()
      addTab(`ORD${id}`, `/apps/order/orders/${id}`)
   }

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Failed to fetch inventory item details!')
      return <ErrorState message="Failed to fetch inventory item details!" />
   }
   return (
      <Wrapper>
         <Flex container alignItems="center">
            <h2 title={inventoryProduct.name}>{inventoryProduct.name}</h2>
            <Flex container width="180px" alignItems="center">
               <span title={inventoryProduct.products.aggregate.count}>
                  Total
               </span>
               <Tooltip identifier="app_order_planned_inventory_item_details_total" />
               : {inventoryProduct.products.aggregate.count}
            </Flex>
            <Flex container width="180px" alignItems="center">
               <span title={inventoryProduct.products.aggregate.sum.quantity}>
                  Quantity
               </span>
               <Tooltip identifier="app_order_planned_inventory_item_details_quantity" />
               : {inventoryProduct.products.aggregate.sum.quantity}
            </Flex>
         </Flex>
         <Spacer size="16px" />
         {inventoryProduct.options.length > 0 ? (
            <>
               <Labels>
                  {inventoryProduct.options.map(option => (
                     <Label
                        key={option.id}
                        onClick={() => setCurrent(option)}
                        isActive={current?.id === option.id}
                     >
                        <h3>{option.label}</h3>
                        <section>
                           {
                              option.orderInventoryProducts.nodes.filter(
                                 node => node.isAssembled
                              ).length
                           }
                           &nbsp;/&nbsp;
                           {option.orderInventoryProducts.aggregate.total}
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
                     {current.orderInventoryProducts.nodes.length > 0 ? (
                        <ListBody>
                           {current.orderInventoryProducts.nodes.map(node => (
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
            <Filler message="No inventory options" />
         )}
      </Wrapper>
   )
}
