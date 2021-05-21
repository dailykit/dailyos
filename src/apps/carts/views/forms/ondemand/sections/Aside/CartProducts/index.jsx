import React from 'react'
import styled from 'styled-components'
import { Flex, Spacer, Text } from '@dailykit/ui'

import { useManual } from '../../../state'
import { currencyFmt } from '../../../../../../../../shared/utils'

const CartProducts = () => {
   const { billing, products } = useManual()
   return (
      <section>
         <Text as="text2">Products({products.aggregate.count})</Text>
         <Spacer size="8px" />
         <Styles.Cards>
            {products.nodes.map(product => (
               <Styles.Card key={product.id}>
                  <aside>
                     {product.image ? (
                        <img
                           src={product.image}
                           alt={product.productOption.name}
                        />
                     ) : (
                        <span>N/A</span>
                     )}
                  </aside>
                  <Flex as="main" container flexDirection="column">
                     <Text as="text2">{product.productOption.name}</Text>
                     <Text as="text3">Price: {currencyFmt(product.price)}</Text>
                  </Flex>
               </Styles.Card>
            ))}
         </Styles.Cards>
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
         position: relative;
         background: #eaeaea;
         padding-top: 56.25%;
         display: flex;
         align-items: center;
         justify-content: center;
         > span {
            font-size: 14px;
            color: #ab9e9e;
            transform: translateY(-78%);
         }
         > img {
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
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