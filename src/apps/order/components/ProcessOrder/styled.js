import styled, { css } from 'styled-components'

export const Wrapper = styled.aside`
   height: 100%;
   padding: 0 12px 12px 12px;
   border-right: 1px solid #e7e7e7;
   border-left: 1px solid #e7e7e7;
`

export const StyledStat = styled.span(
   ({ status }) => css`
      color: #fff;
      display: block;
      font-size: 14px;
      font-weight: 500;
      padding: 3px 6px;
      border-radius: 3px;
      background: ${status === 'PENDING' ? '#FF5A52' : '#53C22B'};
   `
)

export const StyledMode = styled.div`
   height: 40px;
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
   > section:nth-of-type(2) {
      display: flex;
      margin-bottom: 16px;
      flex-direction: column;
      section {
         display: flex;
         margin: 4px 0;
         align-items: center;
         justify-content: space-between;
         span:first-child {
            color: #9aa5ab;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.6px;
            text-transform: uppercase;
         }
      }
   }
`

export const StyledButton = styled.button(
   ({ disabled }) => css`
      color: #fff;
      height: 32px;
      border: none;
      padding: 0 12px;
      cursor: pointer;
      margin-top: 16px;
      margin-right: 16px;
      border-radius: 6px;
      background: #53c22b;
      ${disabled &&
      css`
         color: #9e9292;
         background: #e2e2e2;
         cursor: not-allowed;
      `}
   `
)

export const StyledWeigh = styled.section(
   ({ state }) => css`
      color: #fff;
      height: 180px;
      display: grid;
      padding: 0 16px;
      border-radius: 4px;
      grid-template-rows: 48px 1fr 48px;
      ${state === 'low' && `background: #e7c439`};
      ${state === 'match' && `background: #0ead69`};
      ${state === 'above' && `background: #ea3838`};
      * {
         display: flex;
         align-items: center;
      }
      header {
         justify-content: space-between;
         button {
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
         }
      }
      h2 {
         color: #fff;
         font-size: 32px;
         font-weight: 300;
      }
      h3 {
         color: #fff;
         font-size: 18px;
         font-weight: 400;
      }
   `
)

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
      font-weight: 400;
   }
   span:nth-child(2) {
      grid-area: value;
   }
   div {
      overflow: hidden;
      grid-area: image;
      border-radius: 6px;
      background: #d2dded;
      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
      }
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

export const StyledSOP = styled.section`
   margin-top: 16px;
   h3 {
      font-size: 18px;
      font-weight: 400;
      color: #555b6e;
   }
   div {
      width: 100%;
      margin-top: 8px;
      overflow: hidden;
      border-radius: 6px;
      background: #d2dded;
      padding-top: 56.26%;
      position: relative;
      img {
         top: 0;
         width: 100%;
         height: 100%;
         object-fit: cover;
         position: absolute;
      }
   }
`

export const StyledLabelPreview = styled.section`
   margin-top: 16px;
   header {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }
   h3 {
      font-size: 18px;
      font-weight: 400;
      color: #555b6e;
   }
   div {
      width: 100%;
      margin-top: 8px;
      background: #fff;
      overflow: hidden;
      border-radius: 6px;
   }
`

export const ManualWeight = styled.section`
   display: flex;
   margin-top: 16px;
   align-items: center;
   justify-content: space-between;
   input {
      width: 180px;
      height: 32px;
      padding: 0 8px;
      margin-right: 8px;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.2);
   }
   button {
      height: 32px;
      padding: 0 8px;
      font-size: 14px;
   }
`
