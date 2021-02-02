import React from 'react'

// third party imports
import { useTranslation } from 'react-i18next'
import {
   ComboButton,
   Flex,
   RadioGroup,
   Spacer,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

// shared dir imports
import { Tooltip } from '../../../../../shared/components'
import { useTabs } from '../../../../../shared/providers'

// local imports
import { AddIcon } from '../../../assets/icons'
import {
   ComboProducts,
   CustomizableProducts,
   InventoryProducts,
   SimpleRecipeProducts,
} from './components'
import { ProductTypeTunnel } from './tunnels'
import { ResponsiveFlex } from '../styled'

const address = 'apps.menu.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const [view, setView] = React.useState('inventory')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const options = [
      { id: 'inventory', title: t(address.concat('inventory')) },
      { id: 'simple', title: t(address.concat('simple recipe')) },
      { id: 'customizable', title: t(address.concat('customizable')) },
      { id: 'combo', title: t(address.concat('combo')) },
   ]

   React.useEffect(() => {
      if (!tab) {
         addTab('Products', `/products/products`)
      }
   }, [tab, addTab])

   const renderListing = () => {
      switch (view) {
         case 'inventory':
            return <InventoryProducts />
         case 'simple':
            return <SimpleRecipeProducts />
         case 'customizable':
            return <CustomizableProducts />
         case 'combo':
            return <ComboProducts />
         default:
            return <InventoryProducts />
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <ResponsiveFlex maxWidth="1280px" margin="0 auto">
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               height="72px"
            >
               <Flex container alignItems="center">
                  <Text as="h2">{t(address.concat('products'))}</Text>
                  <Tooltip identifier="products_list_heading" />
               </Flex>
               <ComboButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} /> Add Product
               </ComboButton>
            </Flex>
            <RadioGroup
               options={options}
               active="inventory"
               onChange={option => setView(option.id)}
            />
            <Spacer size="16px" />
            {renderListing()}
         </ResponsiveFlex>
      </>
   )
}

export default ProductsListing
