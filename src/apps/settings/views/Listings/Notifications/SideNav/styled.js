import styled from 'styled-components'

export const StyledContainer = styled.div`
   background: #f3f3f3;
   position: sticky;
   width: 180px;
   height: 100vh;
   padding: 50px 0;
   top: 0;
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
   overflow: hidden;
   font-size: 10px;
   background-color: white;
   a {
      color: #555b6e;
      cursor: pointer;

      &.active {
         color: #00a7e1;
         border: none;
      }
   }
`

export const ListItem = styled.li``
