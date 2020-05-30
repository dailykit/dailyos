import styled from 'styled-components'

export const Wrapper = styled.div`
   height: 100%;
   padding: 0 12px 12px 12px;
   border-right: 1px solid #e7e7e7;
`

export const StyledMode = styled.div`
   height: 32px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   border-bottom: 1px solid #ececec;
`

export const StyledMain = styled.main`
   section:first-child {
      display: flex;
      margin: 8px 0;
      align-items: center;
      justify-content: space-between;
      h4 {
         font-size: 18px;
         color: #555b6e;
      }
   }
   section:nth-child(2) {
      display: flex;
      margin: 8px 0;
      align-items: center;
      span:nth-child(2) {
         flex: 1;
         text-align: center;
      }
   }
`

export const StyledStatus = styled.span``

export const StyledWeigh = styled.section`
   color: #fff;
   height: 180px;
   display: grid;
   padding: 0 16px;
   background: #0ead69;
   grid-template-rows: 48px 1fr 48px;
   * {
      display: flex;
      align-items: center;
   }
   h1 {
      color: #fff;
      font-size: 40px;
   }
`

export const StyledPackaging = styled.section`
   display: grid;
   margin-top: 16px;
   grid-template-columns: 1fr 56px;
   grid-template-rows: 32px 24px;
   grid-template-areas:
      'heading image'
      'value image';
   h3 {
      grid-area: heading;
      font-size: 18px;
      color: #555b6e;
   }
   span:nth-child(2) {
      grid-area: value;
   }
   div {
      grid-area: image;
   }
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
