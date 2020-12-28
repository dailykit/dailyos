import styled, { css } from 'styled-components'

export const Styles = {
   Status: styled.div(
      ({ status }) => css`
         top: -3px;
         right: -3px;
         color: #fff;
         height: 32px;
         cursor: pointer;
         font-size: 14px;
         padding-left: 8px;
         position: absolute;
         align-items: center;
         display: inline-flex;
         background: ${selectColor(status)};
         :hover {
            filter: brightness(85%);
         }
         span {
            width: 32px;
            height: 32px;
            display: block;
            align-items: center;
            display: inline-flex;
            justify-content: center;
         }
      `
   ),
   Order: styled.div(
      ({ status }) => css`
         padding: 16px;
         height: 240px;
         display: grid;
         grid-gap: 14px;
         position: relative;
         border-left-width: 8px;
         border-right-width: 8px;
         border-bottom: 1px solid #ececec;
         grid-template-columns: 220px 1fr 140px;
         border: 3px solid ${selectColor(status)};
         grid-template-areas:
            'left header right'
            'left section right';
         > aside:nth-of-type(1) {
            grid-area: left;
         }
         > aside:nth-of-type(2) {
            grid-area: right;
         }
         > header {
            grid-area: header;
         }
         > section {
            grid-area: section;
            height: calc(240px - 83px);
         }
      `
   ),
}

const selectColor = variant => {
   switch (variant) {
      case 'ALL':
         return '#555B6E'
      case 'PENDING':
         return '#FF5A52'
      case 'UNDER_PROCESSING':
         return '#FBB13C'
      case 'READY_TO_DISPATCH':
         return '#3C91E6'
      case 'OUT_FOR_DELIVERY':
         return '#1EA896'
      case 'DELIVERED':
         return '#53C22B'
      case 'REJECTED_OR_CANCELLED':
         return '#C6C9CA'
      default:
         return '#555B6E'
   }
}
