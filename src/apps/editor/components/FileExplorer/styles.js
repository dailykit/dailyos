import styled, { css } from 'styled-components'

export const FileExplorerWrapper = styled.div(
   ({ isSidebarVisible }) => css`
      width: 100%;
      height: 100vh;
      max-height: 100vh;
      padding-bottom: 16px;
      overflow: auto;
      display: ${isSidebarVisible ? 'block' : 'none'};
   `
)
