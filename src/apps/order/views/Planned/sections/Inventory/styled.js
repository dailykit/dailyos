import styled from 'styled-components'

export const InventoryProducts = styled.ul`
   margin-bottom: 16px;
   li {
      list-style: none;
   }
   > li + li {
      margin-top: 16px;
   }
`

export const InventoryProduct = styled.li`
   padding: 16px;
   border: 1px solid #e1e1e1;
   border-radius: 2px;
   h2 {
      width: 280px;
      font-size: 16px;
      font-weight: 500;
      margin-right: 16px;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
      text-overflow: ellipsis;
   }
   h3 {
      width: 180px;
      font-size: 16px;
      font-weight: 400;
   }
   .optionsHeader {
      height: 32px;
      display: flex;
      align-items: center;
      span {
         width: 240px;
         font-size: 14px;
         color: rgb(136, 141, 157);
      }
   }
`

export const ProductOptions = styled.ul`
   overflow-y: auto;
   max-height: 192px;
`

export const ProductOption = styled.li`
   height: 40px;
   display: flex;
   padding: 0 12px;
   align-items: center;
   background: #f3f3f3;
   border-radius: 2px;
   + li {
      margin-top: 4px;
   }
   span {
      width: 240px;
      font-size: 14px;
      font-weight: 400;
   }
`