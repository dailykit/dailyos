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

export const StyledOrderItem = styled.div(
   ({ status }) => css`
      padding: 20px;
      display: grid;
      border-bottom: 1px solid #ececec;
      grid-template-columns: 320px 1fr 320px;
      border: 3px solid ${selectColor(status)};
      border-left-width: 8px;
      border-right-width: 8px;
      position: relative;
      margin-bottom: 16px;
      > section {
         :nth-child(2) {
            border-left: 1px solid #ececec;
            border-right: 1px solid #ececec;
         }
         header {
            padding: 0 12px;
            margin-bottom: 12px;
         }
         :last-child {
            padding-left: 16px;
         }
      }
   `
)

export const StyledOrderId = styled.h4`
   color: #a3a8b7;
   font-size: 14px;
   font-weight: 400;
   margin-bottom: 16px;
`

export const StyledConsumer = styled.div`
   padding-right: 20px;
`

export const StyledConsumerName = styled.h4`
   font-size: 18px;
   font-weight: 500;
`

export const StyledConsumerAddress = styled.h4`
   color: #718096;
   font-size: 14px;
   margin: 8px 0;
   font-weight: 400;
`

export const StyledConsumerContact = styled.span`
   display: flex;
   color: #555b6e;
   font-size: 14px;
   margin: 8px 0;
   font-weight: 500;
   span {
      height: 24px;
      display: flex;
      align-items: center;
      :first-child {
         margin-right: 8px;
      }
      :last-child {
         transform: translateY(-2px);
      }
   }
`

export const StyledCount = styled.span`
   color: #555b6e;
   font-weight: 500;
`

export const StyledProductItem = styled.div`
   height: 40px;
   display: flex;
   padding: 0 12px;
   margin-bottom: 4px;
   align-items: center;
   background: #fbfbfb;
   justify-content: space-between;
   > div {
      display: flex;
      align-items: center;
   }
`

export const StyledProductTitle = styled.span`
   font-size: 14px;
   font-weight: 500;
`

export const StyledDot = styled.span`
   color: #bfbebe;
   margin: 0 8px;
`

export const StyledServings = styled.div`
   width: auto;
   height: 32px;
   display: flex;
   font-weight: 400;
   align-items: center;
   span {
      display: flex;
      align-items: center;
      :first-child {
         margin-right: 6px;
      }
   }
`

export const StyledStatus = styled.div`
   margin-bottom: 16px;
   padding-left: 16px;
   span {
      :first-child {
         color: #a7a8a6;
         display: block;
         font-size: 13px;
         font-weight: 500;
         margin-bottom: 6px;
         text-transform: uppercase;
      }
   }
`

export const StyledProductTypeTitle = styled.h4`
   color: #a3a8b7;
   font-size: 14px;
   font-weight: 400;
   margin: 12px 0 6px 12px;
   text-transform: uppercase;
`

export const StyledStatusBadge = styled.div(
   ({ status }) => css`
      right: 0;
      bottom: 0;
      color: #fff;
      cursor: pointer;
      position: absolute;
      align-items: center;
      display: inline-flex;
      padding: 8px 16px 6px 16px;
      background: ${selectColor(status)};
      :hover {
         filter: brightness(85%);
      }
      span {
         padding: 4px;
         margin-left: 8px;
         border-radius: 4px;
         align-items: center;
         display: inline-flex;
         justify-content: center;
      }
   `
)
