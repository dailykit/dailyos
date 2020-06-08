import styled from 'styled-components'

export const TableHeader = styled.div`
   display: grid;
   grid-template-columns: 300px repeat(5, 250px);
   font-weight: 500;
   font-size: 14px;
   line-height: 19px;
   color: #555b6e;
   margin-bottom: 8px;
`

export const TableRecord = styled.div`
   display: grid;
   grid-template-columns: 300px 1fr;
   font-weight: 500;
   font-size: 16px;
   line-height: 19px;
   color: #555b6e;
   border: 1px solid #ececec;
   padding: 2px;
   padding-left: 0px;
   align-items: start;
   margin-bottom: 16px;
`
