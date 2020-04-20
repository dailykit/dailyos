import styled from 'styled-components'

export const StyledSelectedUsers = styled.div`
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   > div {
      margin: 0 8px 8px 0;
   }
`

export const StyledPanelHeader = styled.header`
   h2 {
      color: #555b6e;
      font-size: 24px;
      font-weight: 500;
   }
`
