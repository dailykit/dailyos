import styled from 'styled-components'

export const StyledWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   padding: 16px;
`
export const HorizontalCard = styled.div`
   display: flex;
   flex-direction: row;
   padding: 0 10px 10px 10px;
`

export const StyledCard = styled.div`
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
   transition: 0.3s;
   width: 40%;
   margin: 0 20em;
   img {
      width: 100%;
   }
   &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
   }
`
export const StyledInfo = styled.span`
   display: inline;
`
