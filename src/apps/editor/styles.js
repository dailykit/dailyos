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
