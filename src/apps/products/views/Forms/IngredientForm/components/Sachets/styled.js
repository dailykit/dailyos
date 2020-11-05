import styled from 'styled-components'

export const StyledSection = styled.div`
   display: grid;
   grid-template-columns: 250px 1fr;
   grid-gap: 32px;
`

export const StyledListing = styled.div`
   display: flex;
   flex-direction: column;
`

export const StyledDisplay = styled.div`
   background: #fff;
   padding: 0px 28px 28px 0px;
   margin-top: 0;
`

export const StyledListingHeader = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 16px;

   h3 {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #888d9d;
   }

   svg {
      cursor: pointer;
   }
`

export const StyledListingTile = styled.div`
   background: ${props => (props.active ? '#555B6E' : '#fff')};
   color: ${props => (props.active ? '#fff' : '#555B6E')};
   padding: 20px 12px;
   cursor: pointer;
   position: relative;
   margin-bottom: 12px;

   h3 {
      margin-bottom: 20px;
      font-weight: 500;
      font-size: 16px;
      line-height: 14px;
   }

   p {
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      opacity: 0.7;
      &:not(:last-child) {
         margin-bottom: 8px;
      }
   }
`

export const Actions = styled.div`
   position: absolute;
   top: 20px;
   right: 0;

   span {
      margin-right: 12px;
   }
`
