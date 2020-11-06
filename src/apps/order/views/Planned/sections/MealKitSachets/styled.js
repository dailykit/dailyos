import styled, { css } from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

export const StyledTabs = styled(Tabs)(
   () => css`
      display: grid;
      grid-template-columns: 280px 1fr;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #cac7c7;
      :focus {
         outline: none;
         background: #ebebeb;
      }
   `
)

export const StyledTabPanels = styled(TabPanels)(
   () => css`
      overflow-y: auto;
      height: auto !important;
      max-height: 168px !important;
   `
)

export const StyledTabPanel = styled(TabPanel)(
   () => css`
      padding: 0 8px !important;
   `
)

export const List = styled.div(() => css``)

export const ListBody = styled.div(() => css``)

export const ListBodyItem = styled.div(
   ({ isActive, isAssembled }) => css`
      height: 40px;
      display: grid;
      grid-gap: 16px;
      cursor: pointer;
      line-height: 40px;
      grid-template-columns: 100px 1fr;
      border-bottom: 1px solid rgba(128, 128, 128, 0.3);
      background: ${isAssembled ? '#79df54' : '#f9daa8'};
      border-left: ${isActive
         ? `4px solid rgba(0, 0, 0, 0.5)`
         : '4px solid transparent'};
      span {
         padding: 0 14px;
         display: flex;
         align-items: center;
         :last-child {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
         }
      }
   `
)

export const StyledButton = styled.button`
   border: 2px;
   height: 28px;
   display: flex;
   padding: 0 8px;
   color: #787d91;
   cursor: pointer;
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
