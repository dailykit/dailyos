import styled from 'styled-components'

export const Category = styled.div`
   margin-bottom: 32px;
`

export const Title = styled.div`
   display: flex;
   align-items: center;

   span {
      cursor: pointer;
   }
`

export const Products = styled.div`
   padding: 16px 32px;
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 16px;
`

export const Product = styled.div`
   padding: 16px;
   border: 1px solid #f3f3f3;
   display: flex;
   justify-content: space-between;
   align-items: center;

   span {
      &:nth-child(2) {
         display: none;
         cursor: pointer;
         transition: 0.2s ease;
      }
   }

   &:hover {
      span {
         &:nth-child(2) {
            display: block;
         }
      }
   }
`
