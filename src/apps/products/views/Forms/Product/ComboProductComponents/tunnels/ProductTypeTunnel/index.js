import React from 'react'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { SolidTile, TunnelBody } from '../../../tunnels/styled'
import { Tooltip } from '../../../../../../../../shared/components'
import { ProductContext } from '../../../../../../context/product'

const address =
   'apps.menu.views.forms.product.comboproduct.tunnels.producttypetunnel.'

const ProductTypeTunnel = ({ closeTunnel, openTunnel }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(ProductContext)

   const select = type => {
      productDispatch({
         type: 'PRODUCT_TYPE',
         payload: type,
      })
      openTunnel(2)
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select product type'))}
            close={() => closeTunnel(1)}
            tooltip={
               <Tooltip identifier="combo_product_products_type_tunnel" />
            }
         />
         <TunnelBody>
            <SolidTile onClick={() => select('simple')}>
               <Text as="h1">Simple Product</Text>
               <Text as="subtitle">Simple Product</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('customizable')}>
               <Text as="h1">{t(address.concat('customizable product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 3')}>
                     Simple Recipe Product is only one recipe, sold as Meal Kits
                     as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ProductTypeTunnel
