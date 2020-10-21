import styled from 'styled-components'

export const StyledWrapper = styled.div`
   > div {
      margin: 0 auto;
      max-width: 980px;
      width: calc(100vw - 40px);
   }
`

export const StyledHeader = styled.div`
   height: 80px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 0 32px;
`

export const SolidTile = styled.button`
   width: 80%;
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

export const TunnelBody = styled.div`
   padding: 32px;
   height: calc(100% - 106px);
   overflow: auto;
`
