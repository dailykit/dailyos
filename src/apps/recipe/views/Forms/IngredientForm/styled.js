import styled from 'styled-components'

export const Container = styled.div`
   max-width: 1280px;
   margin: 0 auto;
`

export const StyledHeader = styled.div`
   height: 80px;
   display: flex;
   align-items: center;
   justify-content: space-between;
`

export const InputWrapper = styled.div`
   max-width: 256px;
`

export const ActionsWrapper = styled.div`
   display: flex;
   justify-content: space-between;
`

export const StyledMain = styled.div`
   position: relative;
   height: 100%;
   background: #f3f3f3;
   overflow: scroll;
`

export const StyledTop = styled.div`
   display: grid;
   grid-template-columns: 20% 80%;
   grid-gap: 40px;
   height: 192px;
   align-items: center;
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
