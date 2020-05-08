import styled from 'styled-components'

export const StyledLayout = styled.div`
   display: grid;
   grid-template-columns: 270px 1fr;
   grid-gap: 16px;
   padding: 12px;
`

export const StyledPanel = styled.div`
   background: #fff;
   padding: 24px;

   h2 {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: #555b6e;
      margin-bottom: 16px;
   }
`

export const StyledListing = styled.div`
   display: flex;
   flex-direction: column;
`

export const StyledListingTile = styled.div`
   background: ${props => (props.active ? '#555B6E' : '#fff')};
   padding: 8px;
   margin-bottom: 12px;
   color: ${props => (props.active ? '#fff' : '#555B6E')};
   cursor: pointer;

   h3 {
      font-weight: 500;
      font-size: 16px;
      line-height: 14px;
   }
`

export const StyledInputWrapper = styled.div`
   width: ${props => props.width}px;
   display: flex;
   align-items: center;

   input {
      text-align: ${props => props.align || 'left'};
   }

   span {
      cursor: pointer;
   }
`
