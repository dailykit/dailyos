import React from 'react'
import styled, { css } from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

export const SectionTab = ({ title, children }) => {
   return (
      <StyledTab>
         <div>
            <h3>{title}</h3>
            {children}
         </div>
      </StyledTab>
   )
}

export const SectionTabs = styled(Tabs)`
   width: 100%;
   display: grid;
   grid-template-columns: 220px 1fr;
`
export const SectionTabList = styled(TabList)`
   display: flex;
   padding: 0 20px 0 0;
   flex-direction: column;
`
export const StyledTab = styled(Tab)`
   border: none;
   cursor: pointer;
   background: transparent;
   &[data-selected] {
      color: #fff;
      background: #555b6e;
   }
   > div {
      height: 100%;
      padding: 12px;
      text-align: left;
      h3 {
         font-weight: 400;
         font-size: 16px;
      }
   }
`
export const SectionTabPanels = styled(TabPanels)(
   ({ nopadding }) => css`
      background: #fff;
      padding: ${Boolean(nopadding) ? '0' : '24px'};
   `
)

export const SectionTabPanel = styled(TabPanel)``
