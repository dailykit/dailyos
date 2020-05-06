import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { Context } from '../../../context/tabs'

// Components
import {
   IconButton,
   RadioGroup,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import SelectProductTunnel from './SelectProductTunnel'
import {
   InventoryProducts,
   CustomizableProducts,
   ComboProducts,
   SimpleRecipeProducts,
} from './components'

// Styled
import { StyledWrapper, StyledHeader, Spacer } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

const address = 'apps.online_store.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [view, setView] = React.useState('inventory')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const options = [
      { id: 'inventory', title: 'Inventory' },
      { id: 'simple', title: 'Simple Recipe' },
      { id: 'custom', title: 'Customizable' },
      { id: 'combo', title: 'Combo' },
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

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
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
            {/* <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('product name'))}</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.comboProducts.map(product => (
                     <TableRow
                        key={product.id}
                        onClick={() =>
                           addTab('Combo Product', 'comboProduct', product.id)
                        }
                     >
                        <TableCell>{product.name}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table> */}
         </StyledWrapper>
      </>
   )
}

export default ProductsListing
