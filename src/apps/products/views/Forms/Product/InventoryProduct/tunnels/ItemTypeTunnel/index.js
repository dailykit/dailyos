import React from 'react'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { SolidTile, TunnelBody } from '../styled'
import { Tooltip } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.inventoryproduct.tunnels.itemtypetunnel.'

const ItemsTypeTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(InventoryProductContext)

   const select = value => {
      productDispatch({ type: 'META', payload: { name: 'itemType', value } })
      open(2)
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select item type'))}
            close={() => close(1)}
            tooltip={
               <Tooltip identifier="inventory_product_item_type_tunnel" />
            }
         />
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">{t(address.concat('inventory item'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 1')}>
                     Items bought directly from a supplier.
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('sachet')}>
               <Text as="h1">{t(address.concat('sachet item'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 2')}>
                     Items processed and packaged from a supplier item.
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ItemsTypeTunnel
