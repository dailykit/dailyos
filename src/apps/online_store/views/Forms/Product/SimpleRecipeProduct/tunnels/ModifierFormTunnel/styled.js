import styled from 'styled-components'

export const CategoryWrapper = styled.div`
   margin: 16px;
   box-shadow: 0px 0px 5px 1px #ececec;
   padding: 16px;
`

export const OptionWrapper = styled.div`
   margin: 8px;
   border: 1px solid #ececec;
   padding: 8px;
`

export const OptionTop = styled.div`
   display: grid;
   grid-gap: 16px;
   grid-template-columns: 80px 1fr;
   margin-bottom: 12px;

   img {
      width: 80px;
      height: 80px;
      object-fit: cover;
   }

   > div {
      display: grid;
      grid-template-row: repeat(2, 1fr);
   }
`

export const OptionBottom = styled.div`
   display: grid;
   grid-gap: 16px;
   grid-template-columns: 80px repeat(3, 1fr);
`
