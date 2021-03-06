import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Filler, Flex, Spacer } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { QUERIES } from '../../../graphql'
import { useOrder, useTabs } from '../../../context'
import { logger } from '../../../../../shared/utils'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
} from '../../../../../shared/components'
import { SachetItem } from '../../Order/sections'
import { List, Label, Labels, Wrapper } from './styled'

export const InventoryProduct = () => {
   const params = useParams()
   const { state } = useOrder()
   const { tab, addTab } = useTabs()
   const [current, setCurrent] = React.useState({})
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
                        isActive={current?.id === option.id}
                        onClick={() => setCurrent(option)}
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
               {!isEmpty(current) && (
                  <>
                     <List.Head>
                        <Flex container alignItems="center">
                           <span>Ingredients</span>
                           <Tooltip identifier="order_details_mealkit_column_ingredient" />
                        </Flex>
                        <Flex container alignItems="center">
                           <span>Supplier Item</span>
                           <Tooltip identifier="order_details_mealkit_column_supplier_item" />
                        </Flex>
                        <Flex container alignItems="center">
                           <span>Processing</span>
                           <Tooltip identifier="order_details_mealkit_column_processing" />
                        </Flex>
                        <Flex container alignItems="center">
                           <span>Quantity</span>
                           <Tooltip identifier="order_details_mealkit_column_quantity" />
                        </Flex>
                     </List.Head>
                     {!isEmpty(current.orderInventoryProducts.nodes) ? (
                        current.orderInventoryProducts.nodes.map(node =>
                           node.sachets.map(sachet => (
                              <SachetItem item={sachet} />
                           ))
                        )
                     ) : (
                        <Filler message="No products" />
                     )}
                  </>
               )}
            </>
         ) : (
            <Filler message="No inventory options" />
         )}
      </Wrapper>
   )
}
