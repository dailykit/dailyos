import styled from 'styled-components'

export const Layout = styled.div`
   padding: 32px;
   display: grid;
   grid-template-columns: 300px 1fr;
   grid-gap: 32px;
   background: #f3f3f3;
   min-height: calc(100% - 40px);
`

export const Card = styled.div`
   height: 136px;
   display: grid;
   grid-template-rows: repeat(2, 1fr);
   border: 1px solid #ececec;
   background: #fff;

   > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
   }
`

export const Listing = styled.div`
   background: #ffffff;
   border: 1px solid #ececec;
   padding: 24px;
`

export const ListingHeader = styled.div`
   margin-bottom: 16px;
   display: flex;
   justify-content: space-between;
`
