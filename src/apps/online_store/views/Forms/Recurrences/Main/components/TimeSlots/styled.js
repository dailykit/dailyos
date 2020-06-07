import styled from 'styled-components'

export const TableHeader = styled.div`
   display: grid;
   grid-template-columns: repeat(5, 200px);
   font-weight: 500;
   font-size: 14px;
   line-height: 19px;
   color: #555b6e;
   margin-bottom: 8px;
`

export const TableRecord = styled.div`
   display: grid;
   grid-template-columns: 200px 1fr;
   font-weight: 500;
   font-size: 16px;
   line-height: 19px;
   color: #555b6e;
   border: 1px solid #ececec;
   padding: 16px;
   align-items: center;
   margin-bottom: 16px;
`
