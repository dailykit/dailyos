import styled from 'styled-components'

export const StyledWrapper = styled.div`
   display: grid;
   height: 100vh;
   grid-template-rows: 1fr;
   grid-template-columns: 340px 1fr;
   > div {
      height: 100vh;
      overflow-y: auto;
   }
`
