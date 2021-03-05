import styled, { css } from 'styled-components'

export const Wrapper = styled.div(
   ({ column }) => css`
      display: grid;
      grid-template-columns: ${column};
      grid-template-areas: 'sidebar main ';
      width: 100vw;
      height: 10vh;
   `
)

export const StyledWrapper = styled.div`
   display: grid;
   position: relative;
   height: calc(100vh - 115px);
   grid-template-rows: 40px 1fr;
   grid-template-columns: ${({ isOpen }) => (isOpen ? '240px 1fr' : '1fr')};
   grid-template-areas: ${({ isOpen }) =>
      isOpen
         ? "'header header' 'sidebar main'"
         : "'header header' 'main main'"};
   > main {
      grid-area: main;
      overflow-y: auto;
      height: calc(85vh - 40px);
      width: 100%;
   }
   > aside {
      display: flex;
      grid-area: aside;
      flex-direction: column;
   }
   > header {
      grid-area: header;
   }
`
