import styled, { css } from 'styled-components'
import { Tab, Tabs, TabList, TabPanel, TabPanels } from '@reach/tabs'

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
   Products: styled.section(
      () => css`
         display: grid;
         grid-row-gap: 14px;
         grid-template-rows: auto 1fr;
      `
   ),
   Tabs: styled(Tabs)(
      () => css`
         display: grid;
         grid-template-columns: 180px 1fr;
      `
   ),
   TabList: styled(TabList)(
      () => css`
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         [data-selected] {
            background: #ebebeb;
         }
      `
   ),
   Tab: styled(Tab)(
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
   ),
   TabPanels: styled(TabPanels)(
      () => css`
         height: 156px;
         overflow-y: auto;
      `
   ),
   TabPanel: styled(TabPanel)(() => css``),
}

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
