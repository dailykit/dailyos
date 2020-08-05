import styled from 'styled-components'

export const PaymentCard = styled.div`
   background: ${props => props.bgColor || '#ffffff'};
   border: 1px solid #ececec;
   box-sizing: border-box;
   display: flex;
   flex-direction: column;
   margin: ${props => props.margin || '0 32px 16px 0'};
`
export const CardInfo = styled.div`
   padding: 4px 16px;
   display: flex;
   flex-direction: row;
`
// export const CardInfo2 = styled(CardInfo)`
//    justify-content: space-between;
// `
export const BillingAddress = styled.div`
   padding: 16px;
   border-top: 1px solid #ececec;
`
