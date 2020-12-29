import styled, { css } from 'styled-components'

export const Wrapper = styled.div(
   ({ column }) => css`
      display: grid;
      grid-template-columns: ${column};
      grid-template-areas: 'sidebar main sidePanel';
      width: 100vw;
      height: 100vh;
   `
)
