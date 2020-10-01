import styled from 'styled-components'

export const TunnelBody = styled.div`
   padding: 32px;
   height: calc(100% - 106px);
   overflow: auto;
`

export const StyledRow = styled.div`
   margin-bottom: 32px;
`

export const SolidTile = styled.button`
   width: 70%;
   display: block;
   margin: 0 auto;
   border: 1px solid #cecece;
   padding: 10px 20px;
   border-radius: 2px;
   background-color: #fff;

   &:hover {
      background-color: #f3f3f3;
      cursor: pointer;
   }
`

export const StyledInputWrapper = styled.div`
   width: ${props => props.width}px;
`
