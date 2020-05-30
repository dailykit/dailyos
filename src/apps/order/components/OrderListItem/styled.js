import styled, { css } from 'styled-components'
import { Tab, Tabs, TabList, TabPanel, TabPanels } from '@reach/tabs'

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

export const ListBodyItem = styled.div(
   ({ isOpen }) => css`
      background: #fff;
      header {
         margin: 0;
         padding: 0;
         height: 28px;
         display: grid;
         grid-gap: 16px;
         font-size: 14px;
         line-height: 28px;
         grid-template-columns: 1fr 28px;
         border-bottom: 1px solid rgba(0, 0, 0, 0.05);
         button {
            border: none;
            display: flex;
            cursor: pointer;
            align-items: center;
            background: transparent;
            justify-content: center;
            :hover {
               background: rgba(0, 0, 0, 0.05);
            }
         }
      }
      main {
         padding: 4px 0;
         border-top: 1px solid #dddada;
         display: ${isOpen ? 'block' : 'none'};
      }
   `
)

export const StyledOrderItem = styled.div(
   ({ status }) => css`
      padding: 16px;
      height: 240px;
      display: grid;
      border-bottom: 1px solid #ececec;
      grid-template-columns: 280px 1fr;
      border: 3px solid ${selectColor(status)};
      border-left-width: 8px;
      border-right-width: 8px;
      position: relative;
      margin-bottom: 16px;
      > section {
         :first-child {
            padding-right: 16px;
         }
         :last-child {
            padding-left: 16px;
         }
      }
   `
)

export const StyledHeader = styled.header`
   display: flex;
   align-items: center;
   section {
      flex: 1;
      display: flex;
      margin-left: 16px;
      align-items: center;
   }
`

export const StyledViewOrder = styled.button`
   height: 28px;
   display: flex;
   padding: 0 8px;
   color: #787d91;
   cursor: pointer;
   background: #fff;
   font-weight: 500;
   background: white;
   margin-right: 14px;
   align-items: center;
   text-transform: uppercase;
   border: 1px solid rgba(0, 0, 0, 0.2);
   svg {
      margin-left: 2px;
   }
`

export const StyledConsumer = styled.div`
   padding-right: 20px;
`

export const StyledConsumerName = styled.h4`
   font-size: 16px;
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
   float: right;
   color: #555b6e;
   font-weight: 500;
`

export const StyledProductItem = styled.div`
   height: 40px;
   display: flex;
   padding: 0 12px;
   margin-bottom: 4px;
   align-items: center;
   background: #f3f3f3;
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

export const StyledStat = styled.div`
   display: flex;
   margin-bottom: 4px;
   align-items: center;
   justify-content: space-between;
   span {
      :first-child {
         color: #a7a8a6;
         display: block;
         font-size: 14px;
         font-weight: 500;
      }
      :last-child {
         display: block;
         font-size: 14px;
         font-weight: 500;
      }
   }
`

export const StyledStatus = styled.div`
   display: flex;
   margin-right: 16px;
   align-items: center;
   span {
      :first-child {
         color: #a7a8a6;
         display: block;
         font-size: 14px;
         font-weight: 500;
      }
      :last-child {
         display: block;
         font-size: 14px;
         font-weight: 500;
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
      top: 0;
      right: 0;
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

export const StyledTabs = styled(Tabs)(
   () => css`
      display: grid;
      grid-template-columns: 180px 1fr;
   `
)

export const StyledTabList = styled(TabList)(
   () => css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      [data-selected] {
         background: #ebebeb;
      }
   `
)

export const StyledTab = styled(Tab)(
   () => css`
      width: 100%;
      color: #000;
      border: none;
      height: 40px;
      padding: 0 12px;
      text-align: left;
      background: #fff;
      border-bottom: 1px solid #cac7c7;
      :focus {
         outline: none;
         background: #ebebeb;
      }
   `
)

export const StyledTabPanels = styled(TabPanels)(
   () => css`
      height: 100%;
      overflow-y: auto;
   `
)

export const StyledTabPanel = styled(TabPanel)(() => css``)

export const StyledProducts = styled.section(
   () => css`
      height: 202px;
      display: grid;
      padding: 0 16px;
      grid-row-gap: 14px;
      grid-template-rows: auto 1fr;
      border-right: 1px solid #ececec;
      main {
         height: 160px;
         > div {
            height: calc(100% - 16px);
         }
      }
   `
)
