import styled, { css } from 'styled-components'

export const Wrapper = styled.div(
   ({ isSidebarVisible }) => css`
      display: grid;
      grid-template-columns: ${isSidebarVisible ? '240px 1fr' : '40px 1fr'};
      grid-template-areas: 'sidebar main';
      width: 100vw;
      height: 100vh;
   `
)
