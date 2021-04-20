import React from 'react'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { SolidTile, TunnelBody } from '../../../tunnels/styled'
import { Tooltip } from '../../../../../../../../shared/components'
import { ProductContext } from '../../../../../../context/product'

const ProductOptionTypeTunnel = ({ closeTunnel, openTunnel }) => {
   const { productDispatch } = React.useContext(ProductContext)

   const select = value => {
      productDispatch({
         type: 'PRODUCT_OPTION_TYPE',
         payload: value,
      })
      openTunnel(2)
   }

   return (
      <>
         <TunnelHeader
            title="Select product option type"
            close={() => closeTunnel(1)}
            tooltip={<Tooltip identifier="product_option_type_tunnel" />}
         />
         <TunnelBody>
            <SolidTile onClick={() => select('supplier')}>
               <Text as="h1">Supplier Item</Text>
               <Text as="subtitle">Items bought directly from a supplier.</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('sachet')}>
               <Text as="h1">Sachet Item</Text>
               <Text as="subtitle">
                  Items processed and packaged from a supplier item.
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('bulk')}>
               <Text as="h1">Bulk Item</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ProductOptionTypeTunnel
