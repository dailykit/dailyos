import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Flex, Filler } from '@dailykit/ui'

import { List } from '../styled'
import { SachetItem } from './sachet_item'
import { useConfig } from '../../../context'
import { useAccess } from '../../../../../shared/providers'
import { Tooltip, DragNDrop } from '../../../../../shared/components'
import { useDnd } from '../../../../../shared/components/DragNDrop/useDnd'

const address = 'apps.order.views.order.'

const ProductDetails = ({ product }) => {
   const { t } = useTranslation()
   const { state: config } = useConfig()
   const { initiatePriority } = useDnd()
   const { isSuperUser } = useAccess()

   React.useEffect(() => {
      if (!isEmpty(product?.orderSachets)) {
         initiatePriority({
            data: product?.orderSachets,
            tablename: 'orderSachet',
            schemaname: 'order',
         })
      }
   }, [product])

   return (
      <>
         <List.Head>
            <Flex container alignItems="center">
               <span>{t(address.concat('ingredients'))}</span>
               <Tooltip identifier="order_details_mealkit_column_ingredient" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('supplier item'))}</span>
               <Tooltip identifier="order_details_mealkit_column_supplier_item" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('processing'))}</span>
               <Tooltip identifier="order_details_mealkit_column_processing" />
            </Flex>
            <Flex container alignItems="center">
               <span>{t(address.concat('quantity'))}</span>
               <Tooltip identifier="order_details_mealkit_column_quantity" />
            </Flex>
         </List.Head>
         <List.Body>
            {!isEmpty(product?.orderSachets) ? (
               <DragNDrop
                  list={product?.orderSachets}
                  droppableId="sachetItems"
                  tablename="orderSachet"
                  schemaname="order"
               >
                  {product?.orderSachets
                     ?.filter(
                        node =>
                           isSuperUser ||
                           node.packingStationId === config?.current_station?.id
                     )
                     ?.map(item => (
                        <SachetItem
                           item={item}
                           key={item.id}
                           product={product}
                        />
                     ))}
               </DragNDrop>
            ) : (
               <Filler message="There are no sachets linked to this product." />
            )}
         </List.Body>
      </>
   )
}

export default ProductDetails
