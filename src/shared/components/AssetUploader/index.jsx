import React from 'react'
import styled, { css } from 'styled-components'
import { Tabs, TabList, Tab, TabPanel, TabPanels } from '@reach/tabs'

import Images from './Images'
import Upload from './Upload'
import Misc from './Misc'

export const AssetUploader = ({
   onAssetUpload,
   onImageSelect,
   onMiscSelect,
}) => {
   return (
      <StyledTabs defaultIndex={0}>
         <StyledTabList>
            <StyledTab>Upload</StyledTab>
            <StyledTab>Images</StyledTab>
            <StyledTab>Misc</StyledTab>
         </StyledTabList>
         <StyledTabPanels>
            <StyledTabPanel>
               <Upload onAssetUpload={onAssetUpload} />
            </StyledTabPanel>
            <StyledTabPanel>
               <Images onImageSelect={onImageSelect} />
            </StyledTabPanel>
            <StyledTabPanel>
               <Misc onMiscSelect={onMiscSelect} />
            </StyledTabPanel>
         </StyledTabPanels>
      </StyledTabs>
   )
}

const StyledTabs = styled(Tabs)(css`
   height: 480px;
   display: flex;
   border-radius: 3px;
   flex-direction: column;
   border: 1px solid #d7d7d7;
`)

const StyledTabList = styled(TabList)(css`
   padding: 0 !important;
   border-bottom: 1px solid #d7d7d7;
   [data-selected] {
      color: #093880;
      background: #b5cff5;
   }
`)

const StyledTab = styled(Tab)(css`
   border: none;
   height: 36px;
   padding: 0 12px;
   font-size: 16px;
   cursor: pointer;
   border-radius: 3px;
   background: transparent;
`)

const StyledTabPanels = styled(TabPanels)(css`
   flex: 1;
   height: calc(100% - 40px);
`)

const StyledTabPanel = styled(TabPanel)(css`
   overflow: hidden;
   :focus {
      outline: none;
   }
`)
