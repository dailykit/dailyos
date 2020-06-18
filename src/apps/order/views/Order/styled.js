import styled, { css } from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

export const Wrapper = styled.div`
   height: 100%;
   padding: 24px;
   margin: 0 auto;
   > section {
      height: inherit;
   }
`

export const StyledTabs = styled(Tabs)(
   () => css`
      height: inherit;
      margin-top: 16px;
   `
)

export const StyledTabList = styled(TabList)(
   () => css`
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      [data-selected] {
         border-bottom: 2px solid #2cb2e6;
      }
   `
)

export const StyledTab = styled(Tab)(
   () => css`
      border: none;
      height: 32px;
      font-size: 18px;
      margin-right: 14px;
      background: #ffffff;
      :focus {
         outline: none;
         border-bottom: 2px solid #2cb2e6;
      }
   `
)

export const StyledTabPanels = styled(TabPanels)(
   () => css`
      height: inherit;
   `
)

export const StyledTabPanel = styled(TabPanel)(
   () => css`
      height: inherit;
      :focus {
         outline: none;
      }
   `
)

export const Header = styled.header(
   () => css`
      display: flex;
      margin-bottom: 24px;
      align-items: center;
      h3 {
         span {
            color: #9aa5ab;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.6px;
            text-transform: uppercase;
         }
         font-size: 14px;
         font-weight: 400;
      }
      > section {
         flex: 1;
         display: flex;
         align-items: center;
         justify-content: space-around;
         section {
            display: flex;
            align-items: center;
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
)

export const OrderItems = styled.ul(
   () => css`
      display: grid;
      grid-gap: 16px;
      margin-top: 8px;
      margin-bottom: 24px;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
   `
)

export const OrderItem = styled.li(
   ({ isActive }) => css`
      padding: 8px;
      list-style: none;
      ${isActive && `color: #fff`};
      background: ${isActive ? '#353244' : '#f3f3f3'};
      h3 {
         font-size: 14px;
         font-weight: 500;
         line-height: 14px;
      }
      > section {
         display: flex;
         margin-top: 8px;
         align-items: center;
         justify-content: space-between;
      }
   `
)

export const StyledCount = styled.span`
   color: #555b6e;
   font-weight: 500;
`

export const StyledProductTitle = styled.span`
   font-weight: 500;
   font-size: 16px;
   line-height: 14px;
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

export const List = styled.div(() => css``)

export const ListHead = styled.header(
   () => css`
      height: 32px;
      display: grid;
      grid-gap: 16px;
      line-height: 32px;
      grid-template-columns: repeat(4, 1fr) 48px;
      span {
         color: #888d9d;
         padding: 0 14px;
         font-size: 14px;
         font-weight: 400;
      }
   `
)

export const ListBody = styled.div(() => css``)

const selectBg = (arg1, arg2) => {
   const args = [arg1, arg2]
   if (args.every(item => item === true)) {
      return '#79df54'
   }
   if (args.every(item => item === false)) {
      return '#f9daa8'
   }
   if (args.some(item => item === false)) {
      return '#65c6ff'
   }
   return ''
}

export const ListBodyItem = styled.div(
   ({ isOpen, variant: { isLabelled, isPortioned } }) => css`
      background: ${selectBg(isLabelled, isPortioned)};
      header {
         height: 48px;
         display: grid;
         grid-gap: 16px;
         line-height: 48px;
         grid-template-columns: repeat(4, 1fr) 48px;
         span {
            padding: 0 14px;
         }
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
            :focus {
               outline: none;
               background: rgba(0, 0, 0, 0.1);
            }
         }
      }
      main {
         padding: 16px;
         grid-gap: 24px;
         display: ${isOpen ? 'grid' : 'none'};
         border-top: 1px solid rgba(0, 0, 0, 0.2);
         border-bottom: 1px solid rgba(0, 0, 0, 0.2);
         grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
         > section {
            display: flex;
            flex-direction: column;
            span:first-child {
               font-size: 13px;
               font-weight: 500;
               padding-bottom: 6px;
            }
            span:last-child {
               font-size: 18px;
            }
         }
      }
   `
)

export const Legend = styled.div`
   display: flex;
   margin: 16px 0;
   align-items: center;
   h2 {
      font-size: 18px;
      font-weight: 400;
      margin-right: 24px;
   }
   section {
      margin-right: 24px;
      align-items: center;
      display: inline-flex;
      span:first-child {
         height: 8px;
         width: 20px;
         margin-right: 8px;
         border-radius: 8px;
         display: inline-block;
      }
   }
   section {
      :nth-of-type(1) {
         span:first-child {
            background: #f9daa8;
         }
      }
      :nth-of-type(2) {
         span:first-child {
            background: #65c6ff;
         }
      }
      :nth-of-type(3) {
         span:first-child {
            background: #79df54;
         }
      }
   }
`

export const StyledPrint = styled.button`
   width: 28px;
   height: 28px;
   display: flex;
   cursor: pointer;
   background: #fff;
   background: white;
   margin-left: 14px;
   align-items: center;
   justify-content: center;
   border: 1px solid rgba(0, 0, 0, 0.2);
`
