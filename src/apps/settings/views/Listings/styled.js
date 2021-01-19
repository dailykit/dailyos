import { Flex } from '@dailykit/ui'
import styled from 'styled-components'

export const StyledBadge = styled.span`
   border: 1px solid #555b6e;
   height: 24px;
   border-radius: 24px;
   padding: 0 6px;
   font-size: 14px;
`
export const ResponsiveFlex = styled(Flex)`
   @media screen and (max-width: 767px) {
      width: calc(100vw - 32px);
   }
   @media screen and (min-width: 768px) {
      width: calc(100vw - 64px);
   }
`
