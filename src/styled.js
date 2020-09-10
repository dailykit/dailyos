import styled from 'styled-components'

export const StyledWrapper = styled.div`
   display: grid;
   height: 100vh;
   grid-template-columns: 1fr;
   grid-template-rows: 40px 1fr;
   > main {
      overflow-y: auto;
      height: calc(100vh - 40px);
   }
`
