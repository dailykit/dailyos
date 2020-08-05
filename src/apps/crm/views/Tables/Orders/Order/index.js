/* eslint-disable react/jsx-fragments */
import React from 'react'
import { Text, Avatar } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import {CUSTOMER} from "../../../../graphql"
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   StyledCard,
} from '../../../../components'
import {
   StyledWrapper,
   StyledContainer,
   StyledSideBar,
   StyledMainBar,
   StyledTable,
   StyledDiv,
   SideCard,
   Card,
   CardInfo,
} from './styled'

import { ChevronRight} from '../../../../../../shared/assets/icons';
// import { useTabs } from '../../../../context'
const OrderInfo = props => {
   const { data: orderData } = useQuery(CUSTOMER,{
      variables:{
         keycloakId: props.keycloakId,
         orderId:props.orderId
      }
   })
   //    const { addTab } = useTabs()
   const columns = [
      { title: 'Products', field: 'products' },
      { title: 'Servings', field: 'servings' },
      { title: 'Discount', field: 'discount' },
      { title: 'Discounted Price', field: 'discountedPrice' },
   ]
   
   const data = []
   let orderDate ="N/A"
   let totalProductAmount = "N/A"
   let amountPaid = "N/A"
   let discount = "N/A"
   let cardNumber ="XXXX XXXX XXXX XXXX"
   let expiryMonth = "N/A"
   let expiryYear = "N/A"   
   let expiryDate =  "N/A"
   
   if(orderData && orderData.customer.orders[0].orderCart !==null ){
      console.log(orderData.customer.orders[0].deliveryInfo);
       orderDate =orderData ? orderData.customer.orders[0].created_at.substr(0,16) :"N/A"
       totalProductAmount =   orderData.customer.orders[0].orderCart.cartInfo.total
       amountPaid = orderData ? orderData.customer.orders[0].amountPaid :"N/A"
       discount = orderData ? orderData.customer.orders[0].discount :"N/A"
       cardNumber = `XXXX XXXX XXXX ${orderData.customer.orders[0].orderCart.paymentCard.last4}`
       expiryMonth =  orderData.customer.orders[0].orderCart.paymentCard.expMonth 
       expiryYear =  orderData.customer.orders[0].orderCart.paymentCard.expYear    
       expiryDate = `${expiryMonth} / ${expiryYear}` || "N/A"


      orderData.customer.orders[0].orderCart.cartInfo.products.map(product=>{
         return data.push({
            products: product.name,
         servings: product.quantity,
         discount: product.discount,
         discountedPrice: product.totalPrice
         })
      })

   }


   //    const rowClick = (e, row) => {
   //       const { id, name } = row._row.data

   //       const param = '/crm/customers/'.concat(name)
   //       addTab(name, param)
   //    }
   return (
      <StyledWrapper>
         <span style={{ margin: '16px', boxSizing:"border-box"}}>
            <span style={ {color:"#00A7E1",cursor:"pointer"}} onClick={props.backToOrders}>Orders</span> <ChevronRight size="20" /> #{props.orderId}
         </span>
         <Text as="h1">#{props.orderId}</Text>
         <StyledContainer>
            <StyledMainBar>
               <StyledDiv>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                        borderRight: '1px solid #ececec',
                     }}
                  >
                     Ordered on: {orderDate}
                  </div>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                        borderRight: '1px solid #ececec',
                     }}
                  >
                     Deliverd on: N/A
                  </div>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                     }}
                  >
                     Channel:RMK
                  </div>
               </StyledDiv>
               <StyledTable>
                  <ReactTabulator
                     columns={columns}
                     data={data}
                     // rowClick={rowClick}
                     // options={tableOptions}
                  />
                  <CardInfo>
                     <Text as="title">Total</Text>
                     <Text as="title">${totalProductAmount}</Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Overall Discount</Text>
                     <Text as="title">${discount}</Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Wallet Used</Text>
                     <Text as="title">N/A</Text>
                  </CardInfo>
                  <CardInfo bgColor="#f3f3f3">
                     <Text as="h2">Total Paid</Text>
                     <Text as="h2">${amountPaid}</Text>
                  </CardInfo>
               </StyledTable>
            </StyledMainBar>
            <StyledSideBar>
               <PaymentCard
                  cardNumber={cardNumber}
                  cardDate={expiryDate}
                  address="ABC Building No. 123 first floor sector - x, unknow street "
                  bgColor="rgba(243,243,243,0.4)"
                  margin="0 0 16px 0"
               />
               <SideCard>
                  <Text as="subtitle">Invoice Sent To:</Text>
                  <Text as="title">johndoe@gmail.com</Text>
               </SideCard>
               <SideCard>
                  <Text as="subtitle">Delivery Partner:</Text>
                  <Card>
                     <Avatar
                        withName
                        type="round"
                        title="John Doe"
                        url="https://randomuser.me/api/portraits/men/61.jpg"
                     />
                     <CardInfo bgColor="rgba(243, 243, 243, 0.4)">
                        <Text as="p">Total Paid:</Text>
                        <Text as="p">${amountPaid}</Text>
                     </CardInfo>
                  </Card>
               </SideCard>
            </StyledSideBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default OrderInfo
