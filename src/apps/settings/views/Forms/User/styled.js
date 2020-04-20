import styled from 'styled-components'

export const StyledAppItem = styled.div`
   width: 100%;
   padding: 12px 0;
   border-bottom: 1px solid #ececec;
   > div {
      display: flex;
      justify-content: space-between;
      > div {
         display: flex;
         align-items: center;
         > span {
            width: 40px;
            height: 40px;
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
         }
      }
   }
   > ul {
      display: grid;
      padding-left: 36px;
      grid-template-rows: 32px;
      grid-template-columns: 1fr;
      li {
         display: flex;
         list-style: none;
         align-items: center;
         span:first-child {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
         }
      }
   }
`

export const StyledSelect = styled.select`
   height: 40px;
   border: none;
   font-size: 16px;
   font-weight: 400;
   margin-right: 8px;
   border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`

export const StyledDevicesList = styled.ul`
   margin: 12px 0;
   flex-wrap: wrap;
   display: inline-flex;
   li {
      height: 64px;
      display: flex;
      padding: 0 16px;
      list-style: none;
      margin-right: 16px;
      background: #f3f3f3;
      flex-direction: column;
      justify-content: center;
   }
`
