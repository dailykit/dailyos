import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import {
   Flex,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { InlineLoader, Tooltip } from '../../../../../shared/components'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { useTabs } from '../../../context'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'

export default function PackagingPurchaseOrders({ tableRef }) {
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   const {
      loading,
      data: { purchaseOrderItems = [] } = {},
      error,
   } = useSubscription(PURCHASE_ORDERS_SUBSCRIPTION, {
      variables: { type: 'PACKAGING' },
   })

   if (error) {
      toast.error(GENERAL_ERROR_MESSAGE)
      logger(error)
   }

   const openForm = (_, cell) => {
      const { id } = cell.getData()
      const tabTitle = `Purchase Order-${uuid().substring(30)}`
      addTab(tabTitle, `/inventory/purchase-orders/packaging/${id}`)
   }

   const columns = [
      {
         title: 'Id',
         field: 'id',
         headerFilter: false,
         cssClass: 'RowClick',
         cellClick: openForm,
      },
      {
         title: 'Packaging',
         field: 'packaging.name',
         headerFilter: false,
         headerTooltip: col => {
            const identifier = 'purchase_orders_listings_table_item_name'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   if (loading) return <InlineLoader />

   return (
      <HorizontalTabs>
         <HorizontalTabList>
            <HorizontalTab>
               <Flex container alignItems="center">
                  COMPLETED
                  <Tooltip identifier="purchase-orders-listings_COMPLETED_tab" />
               </Flex>
            </HorizontalTab>
            <HorizontalTab>
               <Flex container alignItems="center">
                  PENDING
                  <Tooltip identifier="purchase-orders-listings_PENDING_tab" />
               </Flex>
            </HorizontalTab>
            <HorizontalTab>
               <Flex container alignItems="center">
                  CANCELLED
                  <Tooltip identifier="purchase-orders-listings_CANCELLED_tab" />
               </Flex>
            </HorizontalTab>
            <HorizontalTab>
               <Flex container alignItems="center">
                  UNPUBLISHED
                  <Tooltip identifier="purchase-orders-listings_UNPUBLISHED_tab" />
               </Flex>
            </HorizontalTab>
         </HorizontalTabList>
         <HorizontalTabPanels>
            <HorizontalTabPanel>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems.filter(
                     col => col.status === 'COMPLETED'
                  )}
                  options={tableOptions}
               />
            </HorizontalTabPanel>
            <HorizontalTabPanel>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems.filter(
                     col => col.status === 'PENDING'
                  )}
                  options={tableOptions}
               />
            </HorizontalTabPanel>
            <HorizontalTabPanel>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems.filter(
                     col => col.status === 'CANCELLED'
                  )}
                  options={tableOptions}
               />
            </HorizontalTabPanel>
            <HorizontalTabPanel>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems.filter(
                     col => col.status === 'UNPUBLISHED'
                  )}
                  options={tableOptions}
               />
            </HorizontalTabPanel>
         </HorizontalTabPanels>
      </HorizontalTabs>
   )
}
