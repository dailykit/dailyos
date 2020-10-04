import styled from 'styled-components'

export const StyledHeader = styled.div`
   align-items: center;
   width: 100%;
   display: grid;
   background-color: #ffffff;
   margin-bottom: 0rem;
   padding: 24px;
   grid-template-columns: ${props => props.gridCol || '1fr 1fr'};
   @media (max-width: 780px) {
      width: 100%;
   }
   @media (max-width: 567px) {
      grid-template-columns: 1fr;
   }
`
export const StyledWrapper = styled.div`
   background-color: #e5e5e5;
   h1 {
      color: #555b6e;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
   }
`

export const InputWrapper = styled.div`
   width: 250px;
   background-color: #ffffff;
`
export const StyledComp = styled.div`
   padding: 16px 32px;
   background-color: #e5e5e5;
`
export const StyledRow = styled.div`
   display: flex;
   flex-direction: row;
`
