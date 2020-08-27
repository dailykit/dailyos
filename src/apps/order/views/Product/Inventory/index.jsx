import React from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import { Spacer } from '../../../styled'
import { PLANNED } from '../../../graphql'
import { useOrder, useTabs } from '../../../context'
import { ArrowDownIcon, ArrowUpIcon } from '../../../assets/icons'
import { InlineLoader, Flex } from '../../../../../shared/components'
import {
   List,
   Label,
   Labels,
   Wrapper,
   ListHead,
   ListBody,
   ListBodyItem,
} from './styled'

export const InventoryProduct = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const { state, selectInventory } = useOrder()
   const [current, setCurrent] = React.useState({})
   const [currentPanel, setCurrentPanel] = React.useState(null)
   const { loading, data: { inventoryProduct = {} } = {} } = useSubscription(
      PLANNED.INVENTORY_PRODUCT,
      {
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
      }
   )

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(
            inventoryProduct?.name,
            `/apps/order/planned/inventory/${params.id}`
         )
      }
   }, [tab, loading])

   const selectOption = id => {
      selectInventory(id)
      setCurrentPanel(currentPanel === id ? '' : id)
   }

   if (loading) return <InlineLoader />
   return (
      <Wrapper>
         <Flex container alignItems="center">
            <h2 title={inventoryProduct.name}>{inventoryProduct.name}</h2>
            <h3 title={inventoryProduct.products.aggregate.count}>
               <label>Total:</label> {inventoryProduct.products.aggregate.count}
            </h3>
            <h3 title={inventoryProduct.products.aggregate.sum.quantity}>
               <label>Quantity:</label>{' '}
               {inventoryProduct.products.aggregate.sum.quantity}
            </h3>
         </Flex>
         <Spacer size="16px" />
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
                  <span>Label</span>
                  <span>Quantity</span>
               </ListHead>
               <ListBody>
                  {current.orderInventoryProducts.nodes.map(node => (
                     <ListBodyItem
                        key={node.id}
                        isAssembled={node.isAssembled}
                        isOpen={currentPanel === node.id}
                     >
                        <header>
                           <span>{node.orderId}</span>
                           <span>{node.quantity}</span>
                           <button
                              type="button"
                              onClick={() => selectOption(node.id)}
                           >
                              {currentPanel === node.id ? (
                                 <ArrowDownIcon />
                              ) : (
                                 <ArrowUpIcon />
                              )}
                           </button>
                        </header>
                        <main>{node.quantity}</main>
                     </ListBodyItem>
                  ))}
               </ListBody>
            </List>
         )}
      </Wrapper>
   )
}
