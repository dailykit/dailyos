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
   useTunnel,
} from '@dailykit/ui'
import SelectProductTunnel from './SelectProductTunnel'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

const ProductsListing = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const { loading, error, data } = useQuery(PRODUCTS)

   if (loading) return <h1>loading</h1>
   if (error) return <h1>Start the data-hub server</h1>

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SelectProductTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <h1>Products</h1>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Product Name</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.simpleRecipeProducts.map(product => (
                     <TableRow key={product.id}>
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
