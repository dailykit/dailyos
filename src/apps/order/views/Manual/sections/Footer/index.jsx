import React from 'react'
import { Flex } from '@dailykit/ui'
import styled from 'styled-components'

import { useManual } from '../../state'

export const Footer = () => {
   const { state } = useManual()
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
         {state.mode === 'subscription' && (
            <Flex
               container
               as="section"
               alignItems="center"
               justifyContent="center"
               style={{ background: '#111111' }}
            >
               No weeks available.
            </Flex>
         )}
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
