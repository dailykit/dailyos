import styled, { css } from 'styled-components'

export const HeaderWrapper = styled.div`
   position: fixed;
   left: 0;
   top: 0;
   right: 0;
   z-index: 1000;
`

export const MainWrapper = styled.div`
   padding-top: 40px;
   min-height: calc(100vh - 36px);
   overflow-y: auto;
`

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      flex-shrink: 0;
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)
