import styled from 'styled-components'

export const StyledHeader = styled.div`
   align-items: center;
   width: 100%;
   display: grid;
   margin: 42px 0;
   grid-template-columns: ${props => props.gridCol || '1fr 1fr'};
   @media (max-width: 780px) {
      width: 100%;
   }
   @media (max-width: 567px) {
      grid-template-columns: 1fr;
   }
`
export const StyledWrapper = styled.div`
   margin: 0 auto;
   max-width: 1280px;
   margin-bottom: 80px;
   h1 {
      color: #555b6e;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
   }
`

export const InputWrapper = styled.div`
   width: 250px;
`
