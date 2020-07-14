import React from 'react'
import {
   TunnelHeader,
   Loader,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
} from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { TunnelContainer } from '../../../components'

import { CART_ITEMS } from '../../graphql'

export default function AddressTunnel({ close }) {
   const {
      loading,
      data: { organizationPurchaseOrders_purchaseOrderItem: items = [] } = {},
   } = useQuery(CART_ITEMS, {
      onError: error => {
         toast.error(error.message)
         console.log(error)
      },
   })

   return (
      <>
         <TunnelHeader title="Purchase Orders" close={() => close(1)} />

         <TunnelContainer>
            {loading ? <Loader /> : <Content items={items} />}
         </TunnelContainer>
      </>
   )
}

function Content({ items }) {
   return (
      <Wrapper>
         <h2>{items.length} items</h2>
         <br />

         {items.length ? (
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Packaging Item</TableCell>
                     <TableCell>Package</TableCell>
                     <TableCell>Quantity</TableCell>
                     <TableCell>Total Price</TableCell>
                     <TableCell />
                  </TableRow>
               </TableHead>
               <TableBody>
                  {items.map(item => (
                     <TableRow key={item.id}>
                        <TableCell>{item.packaging.packagingName}</TableCell>
                        <TableCell>{item.purchaseOption.quantity}</TableCell>
                        <TableCell>{item.multiplier}</TableCell>
                        <TableCell>
                           ${' '}
                           {`${
                              item.purchaseOption.salesPrice * item.multiplier
                           }`.slice(0.5)}
                        </TableCell>
                        <TableCell />
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         ) : (
            <h1>Your Cart is empty. Go buy something !</h1>
         )}
      </Wrapper>
   )
}

const Wrapper = styled.div`
   width: 100%;

   h1,
   h2 {
      font-size: 16px;
      color: #555b6e;
   }
`
