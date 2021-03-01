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
   height: 100vh;
   grid-template-rows: 40px 1fr;
   grid-template-columns: ${({ isOpen }) => (isOpen ? '240px 1fr' : '1fr')};
   grid-template-areas: ${({ isOpen }) =>
      isOpen ? "'header header' 'aside main'" : "'header header' 'main main'"};
   > main {
      grid-area: main;
      overflow-y: auto;
      height: calc(100vh - 40px);
      width: ${({ isOpen }) => (isOpen ? '100%' : '100vw')};
   }
   > aside {
      display: flex;
      grid-area: aside;
      flex-direction: column;
   }
   > header {
      width: 100vw;
      grid-area: header;
   }
`
