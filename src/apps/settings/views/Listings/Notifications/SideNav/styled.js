import styled from 'styled-components'

export const StyledContainer = styled.div`
   background: #f3f3f3;
   position: sticky;
   height: 100vh;
   padding: 50px 0;
   top: 0;
   flex: 1;
   min-width: 180px;
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

export const ListItem = styled.li``
