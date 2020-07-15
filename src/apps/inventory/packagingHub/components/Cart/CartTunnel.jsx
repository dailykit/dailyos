import React, { useMemo } from 'react'
import {
   TunnelHeader,
   Loader,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
   TextButton,
} from '@dailykit/ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { TunnelContainer } from '../../../components'
import { FlexContainer } from '../../../views/Forms/styled'
import QuantityHandler from '../QuantityHandler'

import {
   CART_ITEMS,
   REMOVE_CART_ITEM,
   CHANGE_CART_ITEM_QUANTITY,
} from '../../graphql'
import { DeleteIcon } from '../../../assets/icons'

export default function CartTunnel({ close }) {
   const {
      loading,
      data: { organizationPurchaseOrders_purchaseOrderItem: items = [] } = {},
      refetch,
   } = useQuery(CART_ITEMS, {
      fetchPolicy: 'network-only',
      onError: error => {
         toast.error(error.message)
         console.log(error)
      },
   })

   return (
      <>
         <TunnelHeader title="Purchase Orders" close={() => close(1)} />

         <TunnelContainer>
            {loading ? <Loader /> : <Content items={items} refresh={refetch} />}
         </TunnelContainer>
      </>
   )
}

function Content({ items, refresh }) {
   const [deleteCartItem, { loading }] = useMutation(REMOVE_CART_ITEM, {
      onCompleted: () => {
         toast.success('product removed')
         refresh()
      },
      onError: error => {
         toast.error(error.message)
      },
   })

   const [changeQuantity] = useMutation(CHANGE_CART_ITEM_QUANTITY, {
      onCompleted: data => {
         const {
            update_organizationPurchaseOrders_purchaseOrderItem: {
               affected_rows,
            },
         } = data

         if (affected_rows > 0) refresh()
      },
      onError: error => {
         toast.error(error.message)
      },
   })

   const handleDelete = ({ id }) => {
      deleteCartItem({ variables: { id } })
   }

   const handleItemIncrement = ({ id }) => {
      changeQuantity({ variables: { id, quantity: +1 } })
   }

   const handleItemDecrement = ({ id }) => {
      changeQuantity({ variables: { id, quantity: -1 } })
   }

   if (loading) return <Loader />

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
                                          style={{ margin: '20px 8px' }}
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
                           <TableCell>
                              <QuantityHandler
                                 value={item.multiplier}
                                 onInc={() => handleItemIncrement(item)}
                                 onDec={() => handleItemDecrement(item)}
                              />
                           </TableCell>
                           <TableCell>
                              ${' '}
                              {`${
                                 item.purchaseOption.salesPrice *
                                 item.multiplier
                              }`.slice(0.5)}
                           </TableCell>
                           <TableCell>
                              <IconButton
                                 type="ghost"
                                 onClick={() => handleDelete(item)}
                              >
                                 <DeleteIcon color="#FF5A52" />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
               <Calculator items={items} />
            </>
         ) : (
            <h1>Your Cart is empty. Go buy something !</h1>
         )}
      </Wrapper>
   )
}

function Calculator({ items }) {
   const price = useMemo(() => {
      const price = items.reduce((acc, curr) => {
         const currentPrice = curr.purchaseOption.salesPrice * curr.multiplier

         return acc + currentPrice
      }, 0)

      return price.toString().slice(0, 5)
   }, [items])

   return (
      <Wrapper style={{ backgroundColor: '#F3F3F3' }}>
         <PriceBox>
            <h2>
               Total Payable:{' '}
               <span style={{ marginLeft: '3rem' }}>$ {price}</span>
            </h2>

            <TextButton
               style={{ width: '100%', marginTop: '14px' }}
               type="solid"
            >
               Proceed To Pay
            </TextButton>
         </PriceBox>
      </Wrapper>
   )
}

const PriceBox = styled.div`
   width: 30%;
   padding: 24px;
`

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
