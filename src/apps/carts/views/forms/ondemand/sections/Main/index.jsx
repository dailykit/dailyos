import React from 'react'
import styled from 'styled-components'
import { Flex, Filler } from '@dailykit/ui'

import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'

export const Main = () => {
   return (
      <Styles.Main>
         <Flex
            container
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
         >
            <Filler
               width="380px"
               height="320px"
               message="No products available"
               illustration={<EmptyIllo width="240px" />}
            />
         </Flex>
      </Styles.Main>
   )
}

const Styles = {
   Main: styled.main`
      grid-area: main;
      overflow-y: auto;
   `,
   Filler: styled(Filler)`
      p {
         font-size: 14px;
         text-align: center;
      }
   `,
}
