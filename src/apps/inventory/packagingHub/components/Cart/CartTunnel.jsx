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
import { FlexContainer } from '../../../views/Forms/styled'

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
         {items && items.length ? (
            <>
               <h2>{items.length} items</h2>
               <br />
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
                           <TableCell>
                              <FlexContainer style={{ alignItems: 'center' }}>
                                 {Array.isArray(
                                    item.packaging?.assets?.images
                                 ) && item.packaging.assets.images.length ? (
                                    <>
                                       <img
                                          src={
                                             item.packaging?.assets?.images[0]
                                                .url
                                          }
                                          alt=""
                                          height="48px"
                                       />
                                       <span style={{ width: '8px' }} />
                                    </>
                                 ) : null}

                                 <div>
                                    <h1>{item.packaging.packagingName}</h1>
                                    <p>
                                       by{' '}
                                       <span style={{ color: '#00A7E1' }}>
                                          {
                                             item.packaging
                                                .packagingCompanyBrand?.name
                                          }
                                       </span>
                                    </p>
                                 </div>
                              </FlexContainer>
                           </TableCell>
                           <TableCell>
                              <p style={{ margin: 0, fontSize: '14px' }}>
                                 {item.purchaseOption.quantity} units
                                 <Pillar />$ {item.purchaseOption.salesPrice}
                              </p>
                           </TableCell>
                           <TableCell>{item.multiplier}</TableCell>
                           <TableCell>
                              ${' '}
                              {`${
                                 item.purchaseOption.salesPrice *
                                 item.multiplier
                              }`.slice(0.5)}
                           </TableCell>
                           <TableCell />
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </>
         ) : (
            <h1>Your Cart is empty. Go buy something !</h1>
         )}
      </Wrapper>
   )
}

const Wrapper = styled.div`
   width: 100%;
   color: #555b6e;

   h1,
   h2 {
      font-size: 16px;
   }

   p {
      font-size: 12px;
      margin-top: 4px;
   }
`

const Pillar = styled.span`
   margin: 0 8px;
   border: 1px solid #ececec;
`
