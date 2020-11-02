import {
   ComboButton,
   Flex,
   RadioGroup,
   Spacer,
   Tag,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../../../../shared/components/Tooltip'
import { AddIcon } from '../../../assets/icons'
import PackagingPurchaseOrders from './packaging'
import SelectPurchaseOrderTypeTunnel from './SelectPurchaseOrderTypeTunnel'
import ItemPurchaseOrders from './supplierItem'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const [view, setView] = useState('Supplier Items')

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const tableRef = React.useRef()

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

            <RadioGroup
               options={[
                  { id: 1, title: 'Supplier Items' },
                  { id: 2, title: 'Packagings' },
               ]}
               active={1}
               onChange={option => setView(option.title)}
            />

            <Spacer size="16px" />

            {view === 'Supplier Items' ? (
               <ItemPurchaseOrders tableRef={tableRef} />
            ) : (
               <PackagingPurchaseOrders tableRef={tableRef} />
            )}
         </Flex>
      </>
   )
}
