import styled, { css } from 'styled-components'

export const Spacer = styled.div(
   ({ size, xAxis }) => css`
      ${xAxis ? `width: ${size};` : `height: ${size};`}
   `
)

export const Stack = styled.div(
   ({ px = 0, py = 0, justify = 'center' }) => css`
      display: flex;
      align-items: center;
      padding: ${py} ${px};
      justify-content: ${justify};
   `
)
