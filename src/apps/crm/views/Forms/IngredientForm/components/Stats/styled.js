import styled from 'styled-components'

export const StyledContainer = styled.div`
   display: grid;
   grid-template-columns: 300px 1fr;
   grid-gap: 40px;
   height: 192px;
   align-items: center;
   padding: 0 32px;
`

export const StyledStatsContainer = styled.div`
   height: 128px;
   display: flex;
   align-items: flex-end;
`
export const StyledStat = styled.div`
   padding-right: 40px;
   margin-right: 12px;
   color: #555b6e;
   font-weight: 500;
   &:not(:last-child) {
      border-right: 1px solid #dddddd;
   }
   h2 {
      font-size: 20px;
      line-height: 23px;
   }
   p {
      font-size: 14px;
      line-height: 16px;
   }
`

export const PhotoTileWrapper = styled.div`
   width: 464px;
`
export const ImageContainer = styled.div`
   width: 464px;
   height: 128px;
   position: relative;
   img {
      width: 464px;
      height: 128px;
      object-fit: auto;
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
