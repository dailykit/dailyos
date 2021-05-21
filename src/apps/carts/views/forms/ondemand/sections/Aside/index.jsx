import React from 'react'
import styled from 'styled-components'
import { Spacer, TextButton } from '@dailykit/ui'

import CartInfo from './CartInfo'
import CartProducts from './CartProducts'

export const Aside = () => {
   return (
      <Styles.Aside>
         <main>
            <CartProducts />
            <Spacer size="8px" xAxis />
            <CartInfo />
         </main>
         <footer>
            <TextButton type="solid">CHECKOUT</TextButton>
         </footer>
      </Styles.Aside>
   )
}

const Styles = {
   Aside: styled.aside`
      display: flex;
      grid-area: aside;
      background: #f9f9f9;
      flex-direction: column;
      border-left: 1px solid #e3e3e3;
      > main {
         padding: 8px;
         display: flex;
         overflow-y: auto;
         height: calc(100% - 40px);
         > section {
            flex: 1;
         }
      }
      > footer {
         button {
            width: 100%;
            height: 40px;
         }
      }
   `,
   Card: styled.div`
      border-radius: 2px;
      background: #ffffff;
      box-shadow: 0 2px 40px 2px rgb(222 218 218);
      > header {
         button {
            width: 28px;
            height: 28px;
         }
      }
   `,
}
