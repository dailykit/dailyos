import React from 'react'
// Components
import {
   IconButton,
   RadioGroup,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
// Icons
import { AddIcon } from '../../../assets/icons'
// Styled
import { Spacer, StyledHeader, StyledWrapper } from '../styled'
import {
   ComboProducts,
   CustomizableProducts,
   InventoryProducts,
   SimpleRecipeProducts,
} from './components'
import SelectProductTunnel from './SelectProductTunnel'

const address = 'apps.online_store.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const [view, setView] = React.useState('inventory')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const options = [
      { id: 'inventory', title: t(address.concat('inventory')) },
      { id: 'simple', title: t(address.concat('simple recipe')) },
      { id: 'customizable', title: t(address.concat('customizable')) },
      { id: 'combo', title: t(address.concat('combo')) },
   ]

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
               <SelectProductTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('products'))}</h1>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
            <RadioGroup
               options={options}
               active={'inventory'}
               onChange={option => setView(option.id)}
            />
            <Spacer />
            {renderListing()}
            {/* */}
         </StyledWrapper>
      </>
   )
}

export default ProductsListing
