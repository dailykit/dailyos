import styled, { css } from 'styled-components'

export const Wrapper = styled.aside`
   height: 100%;
   padding: 0 12px 12px 12px;
   border-right: 1px solid #e7e7e7;
   border-left: 1px solid #e7e7e7;
`

export const StyledMode = styled.div`
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   border-bottom: 1px solid #ececec;
`

export const StyledHeader = styled.header`
   height: 32px;
   display: flex;
   align-items: center;
   border-bottom: 1px solid #ececec;
   h3 {
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
      color: #555b6e;
   }
`

export const StyledButton = styled.button`
   color: #fff;
   height: 32px;
   border: none;
   padding: 0 12px;
   border-radius: 6px;
   background: #53c22b;
`

export const StyledStat = styled.div(
   ({ status }) => css`
      display: flex;
      margin: 12px 0;
      align-items: center;
      justify-content: space-between;
      span {
         :first-child {
            color: #a7a8a6;
            display: block;
            font-size: 14px;
            font-weight: 400;
         }
         :last-child {
            color: #fff;
            display: block;
            font-size: 14px;
            font-weight: 500;
            padding: 3px 6px;
            border-radius: 3px;
            background: ${status === 'PENDING' ? '#FF5A52' : '#53C22B'};
         }
      }
   `
)
