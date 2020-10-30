import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   ComboButton,
   Flex,
   Loader,
   Spacer,
   Tag,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { Tooltip } from '../../../../../shared/components/Tooltip'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { AddIcon } from '../../../assets/icons'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { useTabs } from '../../../context'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'
import SelectPurchaseOrderTypeTunnel from './SelectPurchaseOrderTypeTunnel'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      loading,
      data: { purchaseOrderItems = [] } = {},
      error,
   } = useSubscription(PURCHASE_ORDERS_SUBSCRIPTION)

   if (error) {
      toast.error(GENERAL_ERROR_MESSAGE)
      logger(error)
   }

   const tableRef = React.useRef()

   const openForm = (_, cell) => {
      const { id, type } = cell.getData()
      const tabTitle = `Purchase Order-${uuid().substring(30)}`
      if (type === 'PACKAGING') {
         addTab(tabTitle, `/inventory/purchase-orders/packaging/${id}`)
      }

      if (type === 'SUPPLIER_ITEM') {
         addTab(tabTitle, `/inventory/purchase-orders/item/${id}`)
      }
   }

   const columns = [
      {
         title: 'Status',
         field: 'status',
         headerFilter: true,
         width: 200,
         cellClick: openForm,
         cssClass: 'RowClick',
         headerTooltip: col => {
            const identifier = 'purchase_orders_listings_table_status'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Item',
         field: 'supplierItem',
         headerFilter: false,
         formatter: reactFormatter(<SupplierItemName />),
         headerTooltip: col => {
            const identifier = 'purchase_orders_listings_table_item_name'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Type',
         field: 'packaging',
         headerFilter: false,
         formatter: reactFormatter(<LabelItem />),
         width: 200,
         headerTooltip: col => {
            const identifier = 'purchase_orders_listings_table_order_type'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <SelectPurchaseOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Flex margin="0 auto" maxWidth="1280px" width="calc(100vw - 64px)">
            <Flex container alignItems="center" justifyContent="space-between">
               <Flex container alignItems="center">
                  <Text as="title">{t(address.concat('purchase orders'))}</Text>
                  <Tooltip identifier="purchase-orders_listings_header_title" />
               </Flex>
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  padding="16px 0"
               >
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <Spacer xAxis size="10px" />
                  <ComboButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon color="#fff" size={24} />
                     Create Purchase Order
                  </ComboButton>
               </Flex>
            </Flex>
            <Spacer size="16px" />
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={purchaseOrderItems}
               options={tableOptions}
            />
         </Flex>
      </>
   )
}

function SupplierItemName({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data.supplierItem && data.supplierItem.name)
      return data.supplierItem.name
   if (data.packaging && data.packaging.packagingName)
      return data.packaging.packagingName
   return 'NA'
}

function LabelItem({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data && data.type === 'PACKAGING')
      return <Tag color="success">Packaging</Tag>
   if (data && data.type === 'SUPPLIER_ITEM')
      return <Tag color="primary">Supplier Item</Tag>

   return <Tag color="danger">NA</Tag>
}
