import styled from 'styled-components'

export const TunnelHeader = styled.div`
   height: 76px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 16px;

   > div {
      display: flex;
      align-items: center;
   }
`

export const TunnelBody = styled.div`
   padding: 16px 32px;
   height: calc(100% - 106px);
   overflow: auto;
`

export const StyledRow = styled.div`
   margin-bottom: 32px;
`

export const StyledInputWrapper = styled.div`
   width: ${props => props.width}px;
   display: flex;
   align-items: center;
`
