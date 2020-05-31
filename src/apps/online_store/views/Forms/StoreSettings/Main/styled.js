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
   padding: 32px;
   height: calc(100% - 106px);
   overflow: auto;
`

export const Fixed = styled.div``

export const ImageContainer = styled.div`
   height: ${props => props.height || 'auto'};
   width: ${props => props.width || 'auto'};
   position: relative;
   img {
      width: ${props => props.width || 'auto'};
      height: ${props => props.height || 'auto'};
      object-fit: cover;
   }
   div {
      position: absolute;
      padding: 12px;
      right: 0;
      left: 0;
      text-align: right;
      background: linear-gradient(to bottom, #111, transparent);
      span {
         margin-right: 16px;
         cursor: pointer;
      }
   }
`
