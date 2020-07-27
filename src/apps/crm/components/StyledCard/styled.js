import styled from 'styled-components'

export const StyledCard = styled.div`
   background: rgba(255, 255, 255, 0.7);
   border: 1px dashed #f3f3f3;
   box-shadow: 3px 3px 16px rgba(0, 0, 0, 0.06);
`
export const CardHeading = styled.div`
   padding: 16px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`
export const CardContent = styled(CardHeading)`
   border-top: 1px solid #ececec;
`
export const ViewTab = styled.span`
   color: #00a7e1;
   font-size: 18px;
   font-weight: normal;
   font-style: normal;
   font-family: Roboto;
   line-height: 14px;
`
