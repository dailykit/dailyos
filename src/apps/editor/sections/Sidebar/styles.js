import styled, { css } from 'styled-components'

export const SidebarWrapper = styled.aside`
    grid-area: sidebar;
`

export const Header = styled.header(
    ({ theme }) => css`
        height: ${theme.basePt * 5}px;
        border-bottom: 1px solid ${theme.border.color};
        display: flex;
        align-items: center;
        justify-content: space-between;
    `
)

export const SidebarActions = styled.div(
    ({ theme }) => css`
        width: ${theme.basePt * 5}px;
        height: ${theme.basePt * 5}px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid ${theme.border.color};
        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }
    `
)

export const FileExplorer = styled.div(
    ({ theme }) => css`
        padding: ${theme.basePt * 2}px;
        overflow-y: auto;
        height: calc(100vh - ${theme.basePt * 5}px);
    `
)
