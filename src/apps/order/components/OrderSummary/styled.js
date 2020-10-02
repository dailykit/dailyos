import styled, { css } from 'styled-components'

export const Wrapper = styled.aside`
   height: 100%;
   padding: 0 12px 12px 12px;
   border-right: 1px solid #e7e7e7;
   border-left: 1px solid #e7e7e7;
   > h2,
   > div > h2 {
      height: 40px;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 500;
      color: #787474;
      display: flex;
      align-items: center;
   }
   button {
      height: 32px;
      padding: 0 12px;
      font-size: 14px;
   }
`

export const FilterSection = styled.section`
   h3 {
      font-size: 14px;
      font-weight: 400;
      color: rgb(136, 141, 157);
   }
   span {
      width: 50%;
      font-size: 14px;
      font-weight: 500;
   }
`

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      flex-shrink: 0;
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)
