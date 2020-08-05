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
   let deliveryCompanyInfo = null;
   let driverInfo = null;
   if(orderData){
      deliveryCompanyInfo = orderData.customer.orders[0].deliveryService
       driverInfo = orderData.customer.orders[0].driverInfo
   }

   if(orderData && orderData.customer.orders[0].orderCart !==null ){
      console.log(orderData.customer.orders[0].deliveryInfo);
       orderDate = orderData.customer.orders[0].created_at.substr(0,16) 
       totalProductAmount =   orderData.customer.orders[0].orderCart.cartInfo.total
       amountPaid =  orderData.customer.orders[0].amountPaid 
       discount =  orderData.customer.orders[0].discount 
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

   if(deliveryCompanyInfo){
      console.log(deliveryCompanyInfo);
   }
   if(driverInfo){
      console.log(driverInfo);
   }

   //    const rowClick = (e, row) => {
   //       const { id, name } = row._row.data

   //       const param = '/crm/customers/'.concat(name)
   //       addTab(name, param)
   //    }
   let deliveryPartner = null;
   let deliveryAgent = null;
   if(deliveryCompanyInfo!==null){
      deliveryPartner = 
         <React.Fragment>
            <Text as="subtitle">Delivery Partner: </Text>
                  <Card>
                     <Avatar
                        withName
                        type="round"
                        title={deliveryCompanyInfo!==null ? `${deliveryCompanyInfo.companyName}` : "N/A"}
                        url={deliveryCompanyInfo!==null ? `${deliveryCompanyInfo.logo}` : ""}
                     />
                     <CardInfo bgColor="rgba(243, 243, 243, 0.4)">
                        <Text as="p">Total Paid:</Text>
                        <Text as="p">${amountPaid}</Text>
                     </CardInfo>
                  </Card>
         </React.Fragment>
   }
   if(driverInfo!==null){
      deliveryAgent = 
      <React.Fragment>
         <Text as="subtitle">Delivery Assign To:</Text>
                  <Card>
                     <Avatar
                        withName
                        type="round"
                        title={driverInfo!==null ? `${driverInfo.driverFirstName} ${driverInfo.driverLastName}` : "N/A"}
                        url={driverInfo!==null ? `${driverInfo.driverPicture}` : ""}
                     />
                     <CardInfo bgColor="rgba(243, 243, 243, 0.4)">
                        <Text as="p">Total Paid:</Text>
                        <Text as="p">${amountPaid}</Text>
                     </CardInfo>
                  </Card>
      </React.Fragment>
   }

   let deliveryInfoCard = null;
   if(deliveryPartner!==null || deliveryAgent!==null )
     deliveryInfoCard =  
        <SideCard>
            {deliveryPartner}
            {deliveryAgent}
         </SideCard>

   return (
      <StyledWrapper>
         <span style={{ margin: '16px', boxSizing:"border-box"}}>
            <span style={ {color:"#00A7E1",cursor:"pointer"}} onClick={props.backToOrders}>Orders</span>
             <ChevronRight size="20" /> #{props.orderId}
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
                  billingAddDisplay="none"
                  bgColor="rgba(243,243,243,0.4)"
                  margin="0 0 16px 0"
               />
               {deliveryInfoCard}
            </StyledSideBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default OrderInfo
