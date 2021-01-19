import styled from 'styled-components'

export const Wrapper = styled.div`
   display: flex;
   background: #fff;
   padding: 18px;
   margin-bottom: 16px;
   section {
      width: 100%;
   }
   @media screen and (max-width: 568px) {
      flex-direction: column;
      section {
         margin-bottom: 8px;
      }
   }
`
