import styled, { css } from 'styled-components'

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

export const ListItem = styled.li(
   ({ variant }) => css`
      padding: 12px;
      list-style: none;
      margin-bottom: 16px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
      border-left: 4px solid ${selectColor(variant)};
      header {
         display: flex;
         align-items: center;
         justify-content: space-between;
         h2 {
            font-weight: 500;
            font-size: 14px;
         }
      }
      main {
         display: flex;
         margin-top: 8px;
         justify-content: space-between;
         span {
            font-size: 20px;
         }
      }
   `
)
