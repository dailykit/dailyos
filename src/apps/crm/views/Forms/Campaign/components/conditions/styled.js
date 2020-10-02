import styled from 'styled-components'

export const StyledContainer = styled.div`
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
   transition: 0.3s;
   background-color: #ffffff;
   width: 45%;
   margin: 16px 0;
   padding: 16px;
   p {
      color: #00a7e1;
      &:hover {
         text-decoration: underline;
      }
   }
   &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
   }
`

export const StyledRow = styled.div`
   margin-bottom: 16px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`

export const StyledAction = styled.div`
   position: absolute;
   right: 16px;
   top: 16px;
`
