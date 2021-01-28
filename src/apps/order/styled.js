import { Tunnel } from '@dailykit/ui'
import styled, { css } from 'styled-components'

export const StyledWrapper = styled.div(
   ({ position }) => css`
      display: grid;
      height: 100vh;
      overflow: hidden;
      grid-template-rows: 1fr 40px;
      grid-template-areas: ${position === 'left'
         ? '"aside main" "footer footer"'
         : '"main aside" "footer footer"'};
      grid-template-columns: ${position === 'left' ? '340px 1fr' : '1fr 340px'};

      > aside {
         grid-area: aside;
         overflow-y: auto;
      }
      > button {
         grid-area: bottomBar;
      }
      > main {
         grid-area: main;
         > main {
            overflow-y: auto;
            scroll-behavior: smooth;
            height: calc(100vh - 80px);
         }
      }
      > footer {
         grid-area: footer;
      }
      @media only screen and (orientation: portrait) {
         grid-template-areas: 'main' 'bottomBar' 'footer';
         grid-template-columns: 100vw;
         grid-template-rows: calc(100vh - 120px) 80px 40px;
         > main > main {
            height: calc(100vh - 160px);
         }
      }
   `
)

export const StyledTunnel = styled(Tunnel)`
   width: 100vw;
   overflow-y: auto;
`

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      flex-shrink: 0;
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)
export const OrderSummaryTunnel = styled.div`
   display: none;
   @media (orientation: portrait) {
      display: block;
   }
`
