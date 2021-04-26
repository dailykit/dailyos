import { IconButton } from '@dailykit/ui'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const TabsWrapper = styled.div`
   display: flex;
   align-items: center;
   > button {
      border: none;
      width: 35px;
      height: 42px;
      background: #fefdfc;
      outline: none;
      cursor: pointer;
   }
`
export const StyledTabs = styled.ul(
   ({ width, numTabs }) => css`
      width: ${`calc(100vw - ${width})`};
      display: flex;
      align-items: center;
      border-bottom: ${numTabs > 0 && `1px solid #ebf1f4`};
   `
)

export const StyledTab = styled.li(
   ({ active }) => css`
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border: ${active ? 'none' : '1px solid #ebf1f4'};
      border-bottom: none;
      height: 42px;
      background: ${active ? '#F6F6F6' : 'transparent'};
      box-shadow: ${active
         ? '1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(234, 234, 234, 0.5), inset -2px 2px 4px rgba(234, 234, 234, 0.2), inset 2px -2px 4px rgba(234, 234, 234, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(234, 234, 234, 0.9)'
         : 'none'};

      span {
         color: ${active ? '#367BF5' : '#919699'};
         display: inline-block;
         font-size: 14px;
         font-weight: 700;
         padding: 6px;
         white-space: nowrap;
         overflow: hidden;
      }
      button {
         border: none;
         display: flex;
         cursor: pointer;
         outline: none;
         align-items: center;
         justify-content: center;
         padding: 6px 14px 6px 6px;
         background: transparent;
      }
   `
)

export const HomeButton = styled(Link)`
   display: flex;
   align-items: center;
   justify-content: center;
   border: ${({ active }) => (active ? 'none' : '1px solid #ebf1f4')};
   width: 40px;
   height: 42px;
   background: ${({ active }) => (active ? '#F6F6F6' : 'transparent')};
   box-shadow: ${({ active }) =>
      active
         ? '1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(234, 234, 234, 0.5), inset -2px 2px 4px rgba(234, 234, 234, 0.2), inset 2px -2px 4px rgba(234, 234, 234, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(234, 234, 234, 0.9)'
         : 'none'};
`
export const StyledButton = styled(IconButton)`
   background: ${({ open }) => (open ? '#fefdfc' : null)};
   box-shadow: ${props =>
      props.open
         ? `1px 1px 2px rgba(255, 255, 255, 0.3),
   -1px -1px 2px rgba(206, 205, 204, 0.5),
   inset -3px 3px 6px rgba(206, 205, 204, 0.2),
   inset 3px -3px 6px rgba(206, 205, 204, 0.2),
   inset -3px -3px 6px rgba(255, 255, 255, 0.9),
   inset 3px 3px 8px rgba(206, 205, 204, 0.9)`
         : null};
`
