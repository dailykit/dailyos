import styled, { css } from 'styled-components'

export const StyledWrapper = styled.div`
   h1 {
      color: #555b6e;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
   }
   table {
      width: 980px;
      margin: 0 auto;
   }
`

export const StyledHeader = styled.div`
   height: 80px;
   display: flex;
   margin: 0 auto;
   align-items: center;
   width: calc(100vw - 40px);
   justify-content: space-between;
   border-bottom: 1px solid #d8d8d8;
`

export const StyledForm = styled.div`
   padding: 40px 0;
   max-width: 520px;
`

export const StyledRow = styled.div`
   display: flex;
   > div {
      width: 280px;
      margin-right: 24px;
      margin-bottom: 24px;
      input {
         font-weight: 400 !important;
      }
   }
`

export const StyledHeading = styled.h3`
   color: #888d9d;
   font-size: 16px;
   font-weight: 400;
`

export const StyledSection = styled.div(
   ({ w, m, p, bg }) => css`
      margin: ${m ? m : '0'};
      padding: ${p ? p : '0'};
      width: ${w ? w : '100%'};
      background: ${bg ? bg : 'transparent'};
   `
)

export const StyledTunnelHeader = styled.div`
   padding: 24px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   > div {
      display: flex;
      align-items: center;
   }
   h1 {
      color: #888d9d;
      font-size: 18px;
      font-weight: 400;
      margin-left: 12px;
   }
`

export const StyledTunnelMain = styled.div`
   padding: 0 24px 24px 24px;
`
