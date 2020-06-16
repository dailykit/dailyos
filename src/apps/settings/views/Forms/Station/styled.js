import styled, { css } from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

export const StyledMain = styled.main`
   padding-bottom: 20px;
   height: calc(100vh - 144px);
   > h3 {
      margin: 24px 0 8px 0;
   }
`

export const StyledTabs = styled(Tabs)(
   () =>
      css`
         height: calc(100% - 31px);
      `
)
export const StyledTabList = styled(TabList)(
   () => css`
      [data-selected] {
         border-bottom: 2px solid #8b8eff;
      }
   `
)
export const StyledTab = styled(Tab)(
   () =>
      css`
         height: 40px;
         border: none;
         font-size: 16px;
         margin-right: 16px;
         background: transparent;
         :focus {
            outline: none;
         }
      `
)

export const StyledTabPanel = styled(TabPanel)(
   () => css`
      height: 100%;
      :focus {
         outline: none;
      }
   `
)

export const StyledTabPanels = styled(TabPanels)(
   () =>
      css`
         padding: 16px;
         background: #e5e5e5;
         height: calc(100% - 42px);
         :focus {
            outline: none;
         }
      `
)

export const TunnelHeader = styled.header(
   () => css`
      height: 64px;
      display: flex;
      padding: 0 16px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e3e3e3;
      h2 {
         font-size: 18px;
         font-weight: 400;
      }
   `
)

export const TunnelMain = styled.main`
   padding: 0 16px;
   overflow-y: auto;
   height: calc(100% - 104px);
`

export const StyledInfo = styled.span`
   color: #1699c8;
   display: block;
   padding: 24px 0;
   text-align: center;
`
