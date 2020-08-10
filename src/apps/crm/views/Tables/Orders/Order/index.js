/* eslint-disable react/jsx-fragments */
import React from 'react'
import { Text, Avatar } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { ORDER } from '../../../../graphql'
import { useTabs } from '../../../../context'
import { Capitalize } from '../../../Forms/Utils'
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
   StyledInput,
   Card,
   CardInfo,
} from './styled'

import { ChevronRight } from '../../../../../../shared/assets/icons'

const OrderInfo = props => {
   const { addTab, dispatch, tab } = useTabs()
   const { data: orderData } = useQuery(ORDER, {
      variables: {
         orderId: tab.data.orderId,
      },
   })

   const setOrderId = orderId => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { orderId },
         },
      })
   }

   const setOrder = order => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { isOrderClicked: order },
         },
      })
   }
   const setData = () => {
      setOrder(false)
      setOrderId('')
   }
   const columns = [
      { title: 'Products', field: 'products' },
      { title: 'Servings', field: 'servings' },
      { title: 'Discount', field: 'discount' },
      { title: 'Discounted Price', field: 'discountedPrice' },
   ]

   const data = []
   if (orderData && orderData.order.orderCart !== null) {
      orderData.order.orderCart.cartInfo.products.map(product => {
         return data.push({
            products: product?.name || 'N/A',
            servings: product?.quantity || 'N/A',
            discount: product.discount || 'N/A',
            discountedPrice: product?.totalPrice || 'N/A',
         })
      })
   }
   //    const rowClick = (e, row) => {
   //       const { id, name } = row._row.data

   //       const param = '/crm/customers/'.concat(name)
   //       addTab(name, param)
   //    }
   let deliveryPartner = null
   let deliveryAgent = null
   if (orderData?.order?.deliveryService !== null) {
      deliveryPartner = (
         <React.Fragment>
            <Text as="subtitle">Delivery Partner: </Text>
            <Card>
               <Avatar
                  withName
                  type="round"
                  title={
                     orderData?.order?.deliveryService?.companyName || 'N/A'
                  }
                  url={orderData?.order?.deliveryService?.logo || ''}
               />
            </Card>
         </React.Fragment>
      )
   }
   if (orderData?.order?.driverInfo !== null) {
      deliveryAgent = (
         <React.Fragment>
            <Text as="subtitle">Delivery Assign To:</Text>
            <Card>
               <Avatar
                  withName
                  type="round"
                  title={`${
                     orderData?.order?.driverInfo?.driverFirstName || ''
                  } ${orderData?.order?.driverInfo?.driverLastName || 'N/A'}`}
                  url={orderData?.order?.driverInfo?.driverPicture || ''}
               />
               <CardInfo bgColor="rgba(243, 243, 243, 0.4)">
                  <Text as="p">Total Paid:</Text>
                  <Text as="p">
                     ${orderData?.order?.deliveryFee?.value || 'N/A'}
                  </Text>
               </CardInfo>
            </Card>
         </React.Fragment>
      )
   }

   let deliveryInfoCard = null
   if (deliveryPartner !== null || deliveryAgent !== null)
      deliveryInfoCard = (
         <SideCard>
            {deliveryPartner}
            {deliveryAgent}
         </SideCard>
      )

   return (
      <StyledWrapper>
         <span style={{ margin: '16px', boxSizing: 'border-box' }}>
            <StyledInput type="button" onClick={setData} value="Orders" />
            <ChevronRight size="20" />
            Order Id: #{tab.data.orderId}
         </span>
         <Text as="h1">Order Id: #{tab.data.orderId}</Text>
         <StyledContainer>
            <StyledMainBar>
               <StyledDiv>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                        borderRight: '1px solid #ececec',
                     }}
                  >
                     Ordered on:{' '}
                     {orderData?.order?.created_at.substr(0, 16) || 'N/A'}
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
                     <Text as="title">
                        ${orderData?.order?.orderCart?.cartInfo?.total || 'N/A'}
                     </Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Overall Discount</Text>
                     <Text as="title">
                        ${orderData?.order?.discount || 'N/A'}
                     </Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Wallet Used</Text>
                     <Text as="title">N/A</Text>
                  </CardInfo>
                  <CardInfo bgColor="#f3f3f3">
                     <Text as="h2">Total Paid</Text>
                     <Text as="h2">
                        ${orderData?.order?.amountPaid || 'N/A'}
                     </Text>
                  </CardInfo>
               </StyledTable>
            </StyledMainBar>
            <StyledSideBar>
               <PaymentCard
                  cardData={orderData?.order?.orderCart?.paymentCard || 'N/A'}
                  billingAddDisplay="none"
                  bgColor="rgba(243,243,243,0.4)"
                  margin="0 0 16px 0"
                  defaultTag="(Used for this order)"
               />
               {deliveryInfoCard}
            </StyledSideBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default OrderInfo
