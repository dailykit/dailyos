import styled from 'styled-components'

export const Card = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: space-between;
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
   transition: 0.3s;
   background-color: #ffffff;
   width: 100%;
   margin: 0 8px;
   padding: 16px;
   cursor: pointer;
   &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      background-color: #e5e5e5;
      p {
         font-weight: bold;
      }
   }
   p {
      margin-top: 8px;
   }
`
export const Cross = styled.span`
   margin: 0;
   cursor: pointer;
   svg {
      &:hover {
         stroke: red;
      }
   }
`
export const Type = styled.div`
   display: flex;
   padding: 10px;
   flex-direction: row;
   align-items: flex-start;
   p {
      margin: 0 16px;
      font-size: 16px;
      font-weight: 500px;
   }
   &:hover {
      background-color: #f3f3f3;
   }
`
