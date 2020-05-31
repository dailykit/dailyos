import styled from 'styled-components'

export const Fixed = styled.div``

export const ImageContainer = styled.div`
   height: 200px;
   position: relative;
   img {
      width: auto;
      height: 100%;
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
