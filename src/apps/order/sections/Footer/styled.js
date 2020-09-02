import styled, { css } from 'styled-components'

export const Wrapper = styled.footer`
   display: flex;
   padding: 0 12px;
   background: #d9e9f1;
   align-items: center;
`

export const Section = styled.section`
   display: flex;
   font-size: 14px;
   align-items: center;
   span:first-child {
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
   }
   + section {
      margin-left: 24px;
   }
`

export const StatusBadge = styled.span(
   ({ status }) => `
   height: 8px;
   width: 8px;
   margin-left: 8px;
   border-radius: 50%;
   display: inline-block;
   ${
      status === 'online'
         ? css`
              background: #2fc64d;
           `
         : css`
              background: #c2cac3;
           `
   }
`
)
