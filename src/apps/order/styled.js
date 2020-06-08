import styled, { css } from 'styled-components'

export const StyledWrapper = styled.div(
   ({ position }) => css`
      display: grid;
      height: 100vh;
      grid-template-rows: 1fr;
      grid-template-columns: ${position === 'left' ? '340px 1fr' : '1fr 340px'};
      > div {
         :first-child {
            height: 100vh;
            overflow-y: auto;
         }
         :nth-child(1) {
            height: 100vh;
            overflow-y: auto;
         }
      }
   `
)
