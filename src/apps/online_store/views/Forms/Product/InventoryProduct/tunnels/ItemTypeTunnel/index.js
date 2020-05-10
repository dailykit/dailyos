import React from 'react'
import { Text } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { CloseIcon } from '../../../../../../assets/icons'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { SolidTile, TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.itemtypetunnel.'

const ProductsTypeTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(InventoryProductContext)

   const select = value => {
      productDispatch({ type: 'META', payload: { name: 'itemType', value } })
      open(3)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">{t(address.concat('select item type'))}</Text>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">{t(address.concat('inventory item'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 1')}>
                     Bleh Bleh Bleh
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('sachet')}>
               <Text as="h1">{t(address.concat('sachet item'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 2')}>
                     Blah Blah Blah
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductsTypeTunnel
