import styled from 'styled-components'

export const Container = styled.div`
   width: 50%;
   margin: 24px auto;
`

export const CircleButton = styled.button`
   background-color: #fff;
   padding: 30px;
   border: 0;
   border-radius: 50%;
   width: 9rem;
   height: 9rem;
   box-shadow: -3px 4px 4px rgba(0, 0, 0, 0.05);

   &:hover {
      background-color: #f4f4f4;
      cursor: pointer;
   }
`
