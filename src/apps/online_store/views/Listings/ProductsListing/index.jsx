import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { COMBO_PRODUCTS } from '../../../graphql'
import { Context } from '../../../context/tabs'

// Components
import {
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import SelectProductTunnel from './SelectProductTunnel'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.listings.productslisting.'

const ProductsListing = () => {
<<<<<<< HEAD
   const { t } = useTranslation()
=======
   const { dispatch } = React.useContext(Context)
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const { loading, error, data } = useQuery(COMBO_PRODUCTS)

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   if (loading) return <h1>{t(address.concat('loading'))}</h1>
   if (error) return <h1>{t(address.concat('start the data-hub server'))}</h1>

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SelectProductTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
<<<<<<< HEAD
               <h1>{t(address.concat('products'))}</h1>
               <IconButton type='solid' onClick={() => openTunnel(1)}>
                  <AddIcon color='#fff' size={24} />
=======
               <h1>Products</h1>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59
               </IconButton>
            </StyledHeader>
            <Table>
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
            </Table>
         </StyledWrapper>
      </>
   )
}

export default ProductsListing
