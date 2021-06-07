import React from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { LoyaltyPoints, Coupon } from '../../../../../../components'
import {
   Filler,
   Flex,
   Form,
   IconButton,
   Spacer,
   Text,
   TextButton,
   ButtonTile,
} from '@dailykit/ui'

import { useManual } from '../../../state'
import { MUTATIONS, QUERIES } from '../../../../../../graphql'
import { currencyFmt, logger } from '../../../../../../../../shared/utils'
import {
   CloseIcon,
   DeleteIcon,
} from '../../../../../../../../shared/assets/icons'
import EmptyIllo from '../../../../../../assets/svgs/EmptyIllo'

const CartProducts = () => {
   const { billing, products, customer, tunnels, loyaltyPoints } = useManual()
   const [remove] = useMutation(MUTATIONS.CART.ITEM.DELETE, {
      onCompleted: () => toast.success('Successfully deleted the product.'),
      onError: () => toast.error('Failed to delete the product.'),
   })
   return (
      <section>
         <Text as="text2">Products({products.aggregate.count})</Text>
         <Spacer size="8px" />
         {products.aggregate.count > 0 ? (
            <Styles.Cards>
               {products.nodes.map(product => (
                  <Styles.Card key={product.id}>
                     <aside>
                        {product.image ? (
                           <img src={product.image} alt={product.name} />
                        ) : (
                           <span>N/A</span>
                        )}
                     </aside>
                     <Flex
                        container
                        alignItems="center"
                        justifyContent="space-between"
                     >
                        <Flex as="main" container flexDirection="column">
                           <Text as="text2">{product.name}</Text>
                           <Text as="text3">
                              Price: {currencyFmt(product.price)}
                           </Text>
                        </Flex>
                        <IconButton
                           size="sm"
                           type="ghost"
                           onClick={() =>
                              remove({ variables: { id: product.id } })
                           }
                        >
                           <DeleteIcon color="#ec3333" />
                        </IconButton>
                     </Flex>
                  </Styles.Card>
               ))}
            </Styles.Cards>
         ) : (
            <Filler
               height="160px"
               message="No products added yet!"
               illustration={<EmptyIllo />}
            />
         )}
         <Spacer size="16px" />
         <LoyaltyPoints loyaltyPoints={loyaltyPoints} />
         <Spacer size="16px" />
         <Coupon customer={customer} tunnels={tunnels} />
         <Spacer size="16px" />
         <section>
            <Text as="text2">Billing Details</Text>
            <Spacer size="8px" />
            <Styles.Bill>
               <span>Item Total</span>
               <span>{currencyFmt(billing?.itemTotal)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Delivery Price</span>
               <span>{currencyFmt(billing?.deliveryPrice)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Tax</span>
               <span>{currencyFmt(billing?.tax)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Wallet Amount Used</span>
               <span>{currencyFmt(billing?.walletAmountUsed)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Loyalty Points Used </span>
               <span>{billing?.loyaltyPointsUsed}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Discount</span>
               <span>{currencyFmt(billing?.discount)}</span>
            </Styles.Bill>
            <Styles.Bill>
               <span>Total Price</span>
               <span>{currencyFmt(billing?.totalPrice)}</span>
            </Styles.Bill>
         </section>
      </section>
   )
}

export default CartProducts

const Styles = {
   Cards: styled.ul`
      overflow-y: auto;
      max-height: 264px;
   `,
   Card: styled.li`
      padding: 4px;
      display: grid;
      grid-gap: 8px;
      min-height: 56px;
      border-radius: 2px;
      background: #ffffff;
      border: 1px solid #ececec;
      grid-template-columns: auto 1fr;
      + li {
         margin-top: 8px;
      }
      aside {
         width: 56px;
         height: 42px;
         display: flex;
         background: #eaeaea;
         align-items: center;
         justify-content: center;
         > span {
            font-size: 14px;
            color: #ab9e9e;
         }
         > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
         }
      }
   `,
   Bill: styled.section`
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
         font-size: 14px;
      }
   `,
}
