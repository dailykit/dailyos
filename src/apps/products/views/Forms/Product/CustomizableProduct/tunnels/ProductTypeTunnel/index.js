import React from 'react'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import { SolidTile, TunnelBody } from '../styled'
import { Tooltip } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.customizableproduct.tunnels.productstypetunnel.'

const ProductTypeTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(CustomizableProductContext)

   const select = type => {
      productDispatch({
         type: 'META',
         payload: {
            name: 'productType',
            value: type,
         },
      })
      open(2)
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select product type'))}
            close={() => close(1)}
            tooltip={
               <Tooltip identifier="customizable_product_products_type_tunnel" />
            }
         />
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">{t(address.concat('inventory product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 1')}>
                     Inventory product is just an item, supplied or bought
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('simple')}>
               <Text as="h1">{t(address.concat('simple recipe product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 2')}>
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
