import styled, { css } from 'styled-components'

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)

export const Stack = styled.div(
   ({ justify }) => css`
      display: flex;
      align-items: center;
      justify-content: ${justify};
   `
)
