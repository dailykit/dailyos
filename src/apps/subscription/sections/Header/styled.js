import styled from 'styled-components'

export const StyledHeader = styled.header`
   background: #d9e9f1;
   display: flex;
`

export const StyledMenu = styled.div`
   width: 40px;
   height: 40px;
   display: flex;
   cursor: pointer;
   align-items: center;
   justify-content: center;
   :hover,
   :focus {
      background: #fff;
   }
`

export const StyledNav = styled.div`
   display: flex;
   border-left: 1px solid #b4d5e6;
   button {
      width: 40px;
      height: 40px;
      border: none;
      cursor: pointer;
      background: transparent;
      :hover,
      :focus {
         background: #fff;
      }
   }
`
