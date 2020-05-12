import React from 'react'
import { Text } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { CloseIcon } from '../../../../../../assets/icons'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { SolidTile, TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.productstypetunnel.'

const ProductsTypeTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(SimpleProductContext)

   const select = value => {
      productDispatch({
         type: 'META',
         payload: { name: 'productsType', value },
      })
      open(5)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(5)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('select product type'))}
               </Text>
            </div>
         </TunnelHeader>
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
                     Simple Recipe product is only one recipes, sold as Meal
                     Kits as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductsTypeTunnel
