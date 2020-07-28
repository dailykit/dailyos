import styled from 'styled-components'

export const StyledContainer = styled.div`
   background: #f3f3f3;
   position: fixed;
   width: 180px;
   z-index: -1;
   height: 100vh;
   top: 0;
   padding: 60px 0;
`

export const List = styled.div`
   display: flex;
   flex-direction: column;

   a {
      display: block;
      padding: 16px 8px;
      color: #555b6e;
      font-weight: 500;
      font-size: 18px;
      cursor: pointer;

      &.active {
         border-left: 5px solid #00a7e1;
         background-color: #ffffff;
      }
   }
`

export const Icon = styled.span`
   position: absolute;
   right: 1vw;
`

export const Accordion = styled.div`
   display: none;
   overflow: hidden;
   font-size: 10px;
   background-color: white;
`

export const ListItem = styled.li``
