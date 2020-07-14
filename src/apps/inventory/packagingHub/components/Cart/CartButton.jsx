import React from 'react'
import styled from 'styled-components'
import { ComboButton } from '@dailykit/ui'

import { CartIcon } from '../../../assets/icons'

export default function CartButton() {
   return (
      <Wrapper>
         <ComboButton type="solid">
            <CartIcon />
            Go To Purchase Orders
         </ComboButton>
      </Wrapper>
   )
}

const Wrapper = styled.div`
   position: absolute;
   padding: 32px;
   top: 0;
   right: 0;
   z-index: 2;
`
