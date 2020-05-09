import styled from 'styled-components'

export const FlexContainer = styled.div`
   display: flex;
`

export const Flexible = styled.div`
   flex: ${({ width }) => width};
`
