import React from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Flex, Filler } from '@dailykit/ui'

import { List } from '../styled'
import { Tooltip } from '../../../../../shared/components'

import { SachetItem } from './sachet_item'

const address = 'apps.order.views.order.'

const ProductDetails = ({ product }) => {
   const { t } = useTranslation()

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
               product?.orderSachets?.map(item => (
                  <SachetItem item={item} key={item.id} product={product} />
               ))
            ) : (
               <Filler message="There are no sachets linked to this product." />
            )}
         </List.Body>
      </>
   )
}

export default ProductDetails
