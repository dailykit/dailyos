import React from 'react'
import styled from 'styled-components'
import { Flex } from '@dailykit/ui'

export const Footer = () => {
   return (
      <Styles.Footer>
         <Flex
            container
            as="section"
            alignItems="center"
            justifyContent="center"
         >
            No categories available.
         </Flex>
         <Flex
            container
            as="section"
            alignItems="center"
            justifyContent="center"
            style={{ background: '#111111' }}
         >
            No weeks available.
         </Flex>
      </Styles.Footer>
   )
}

const Styles = {
   Footer: styled.footer`
      display: flex;
      grid-area: footer;
      flex-direction: column;
      border-top: 1px solid #e3e3e3;
      > section {
         height: 40px;
      }
   `,
}
