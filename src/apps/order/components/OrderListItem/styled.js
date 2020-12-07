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

export const Styles = {
   Accordian: styled.div(
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
            overflow-y: auto;
            max-height: 120px;
            padding: 4px 12px 0 0;
            border-top: 1px solid #dddada;
            display: ${isOpen ? 'block' : 'none'};
         }
      `
   ),
}

export const StyledOrderItem = styled.div(
   ({ status }) => css`
      padding: 16px;
      height: 240px;
      display: grid;
      border-bottom: 1px solid #ececec;
      grid-template-columns: 220px 1fr 180px;
      border: 3px solid ${selectColor(status)};
      border-left-width: 8px;
      border-right-width: 8px;
      position: relative;
      > section {
         :last-child {
            padding-left: 16px;
         }
      }
   `
)

export const StyledCount = styled.span`
   float: right;
   color: #555b6e;
   font-weight: 500;
`

export const StyledProductItem = styled.div`
   height: 40px;
   display: grid;
   grid-gap: 24px;
   padding: 0 12px;
   margin-bottom: 4px;
   align-items: center;
   background: #f3f3f3;
   grid-template-columns: 240px 1fr auto;
   > div {
      display: flex;
      align-items: center;
   }
`

export const StyledProductTitle = styled.span`
   font-size: 14px;
   font-weight: 500;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
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
      top: -3px;
      right: -8px;
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
