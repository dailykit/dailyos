import styled from 'styled-components'

export const CardWrapper = styled.div`
   height: 238px;
   width: 475px;
   border: 1px solid #ececec;
   background: #fff;
   position: relative;

   cursor: pointer;
`

export const CardContent = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: 12px;
   margin-left: 12px;
`

export const CardImage = styled.div`
   flex: 1.3;
`

export const CardData = styled.div`
   flex: 2;
   margin-left: 40px;

   h1 {
      font-size: 28px;
      line-height: 27px;
      color: #555b6e;
      margin: 12px 0;
      margin-top: 0;
      padding-right: 8px;
   }
`

export const Lead = styled.p`
   font-weight: 500;
   font-size: 12px;
   line-height: 11px;
`

export const Flexi = styled.div`
   display: flex;
   align-items: flex-end;
   p {
      margin: 0;

      font-size: 16px;
      line-height: 19px;
      color: #555b6e;
   }
   span {
      font-size: 10px;
      line-height: 12px;

      color: #555b6e;
   }
`

export const FlexiSpaced = styled(Flexi)`
   justify-content: space-between;
   width: 60%;
   margin-top: 12px;
`

export const CardPrice = styled.span`
   font-style: italic;
   font-weight: 500;
   font-size: 12px;
   line-height: 14px;
   color: #ff7a4d;
   margin-top: 12px;
`

export const ActionButton = styled.button`
   width: 100%;
   border: 0;
   color: #fff;
   font-size: 14px;
   padding: 8px;
   background: linear-gradient(180deg, #28c1f7 -4.17%, #00a7e1 100%);
   cursor: pointer;

   position: absolute;
   bottom: 0;
   left: 0;
`
