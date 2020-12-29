import styled, { css } from 'styled-components'

export const Parent = styled.ul`
    height: auto;
`

export const Node = styled.ul(
    ({ theme, isOpen }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: ${theme.basePt * 4}px;
        border-radius: ${theme.basePt / 2}px 0 0 ${theme.basePt / 2}px;
        cursor: pointer;
        font-size: ${theme.basePt * 1.75}px;
        padding: 0 ${theme.basePt * 2}px;
        background: transparent;
        color: ${isOpen ? '#000' : '#9ca2a7'};
        border-right: ${isOpen ? '4px solid #69A1F6' : '4px solid transparent'};
        &:hover {
            background: #f0f0f0;
        }
    `
)

export const Icon = styled.i(
    ({ theme }) => css`
        cursor: pointer;
        height: ${theme.basePt * 2.5}px;
        width: ${theme.basePt * 2.5}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background: #dfdfdf;
        }
    `
)

export const Children = styled.li(
    ({ theme }) => css`
        list-style: none;
        padding-left: ${theme.basePt * 2}px;
    `
)
