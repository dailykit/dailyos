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
      > main {
         grid-area: main;
         overflow-y: auto;
         scroll-behavior: smooth;
         height: calc(100vh - 80px);
      }
      > footer {
         grid-area: footer;
      }
   `
)

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      flex-shrink: 0;
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)
