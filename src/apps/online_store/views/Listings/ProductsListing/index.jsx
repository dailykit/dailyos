import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { PRODUCTS } from '../../../graphql'

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
   useTunnel
} from '@dailykit/ui'
import SelectProductTunnel from './SelectProductTunnel'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.listings.productslisting.'

const ProductsListing = () => {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const { loading, error, data } = useQuery(PRODUCTS)

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
               <h1>{t(address.concat('products'))}</h1>
               <IconButton type='solid' onClick={() => openTunnel(1)}>
                  <AddIcon color='#fff' size={24} />
               </IconButton>
            </StyledHeader>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('product name'))}</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.products.map(product => (
                     <TableRow key={product.id}>
                        <TableCell>{product.title}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </StyledWrapper>
      </>
   )
}

export default ProductsListing
