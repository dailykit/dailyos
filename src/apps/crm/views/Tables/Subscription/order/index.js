import React, { useRef } from 'react'
import { Text, Avatar, useTunnel, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { ORDER } from '../../../../graphql'
import { useTabs } from '../../../../context'
import { capitalizeString } from '../../../../Utils'
import { PaymentCard } from '../../../../components'
import { ChevronRight } from '../../../../../../shared/assets/icons'
import {
   OrderStatusTunnel,
   PaymentStatusTunnel,
} from '../../../Forms/CustomerRelation/Tunnel'
import {
   StyledWrapper,
   StyledContainer,
   StyledSideBar,
   StyledMainBar,
   StyledTable,
   StyledDiv,
   StyledSpan,
   SideCard,
   StyledInput,
   SmallText,
   Card,
   CardInfo,
   Heading,
} from './styled'
import { toast } from 'react-toastify'
import { Tooltip } from '../../../../../../shared/components'
import { useTooltip } from '../../../../../../shared/providers'
import { logger } from '../../../../../../shared/utils'
import options from '../../../tableOptions'

const OrderInfo = () => {
   const { dispatch, tab } = useTabs()
   const { tooltip } = useTooltip()
   const tableRef = useRef()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [tunnels1, openTunnel1, closeTunnel1] = useTunnel(1)
   const { data: orderData } = useQuery(ORDER, {
      variables: {
         orderId: tab.data.oid,
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   const setOrder = (orderId, order) => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { oid: orderId, isOccurencesClicked: order },
         },
      })
   }

   const columns = [
      {
         title: 'Products',
         field: 'products',
         hozAlign: 'left',
         width: 300,
         headerTooltip: function (column) {
            const identifier = 'subscription_product_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Servings',
         field: 'servings',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'subscription_product_listing_serving_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
      {
         title: 'Discount',
         field: 'discount',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'subscription_product_listing_discount_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
      {
         title: 'Discounted Price',
         field: 'discountedPrice',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'subscription_product_listing_price_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
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

   let deliveryPartner = null
   let deliveryAgent = null
   if (orderData?.order?.deliveryService !== null) {
      deliveryPartner = (
         <>
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
         </>
      )
   }
   if (orderData?.order?.driverInfo !== null) {
      deliveryAgent = (
         <>
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
         </>
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
         <Heading>
            <StyledContainer
               style={{ margin: '16px', boxSizing: 'border-box' }}
            >
               <StyledInput
                  type="button"
                  onClick={() => setOrder('', false)}
                  value="Occurences"
               />
               <ChevronRight size="20" />
               <Text as="p">Order Id: #{tab.data.oid}</Text>
            </StyledContainer>
            <SmallText onClick={() => openTunnel(1)}>
               Check Order Status
            </SmallText>
         </Heading>
         <Flex container margin="0 0 0 6px" height="80px" alignItems="center">
            <Text as="h1">Order Id: #{tab.data.oid}</Text>
            <Tooltip identifier="product_list_heading" />
         </Flex>
         <StyledContainer>
            <StyledMainBar>
               <StyledDiv>
                  <StyledSpan>
                     Ordered on:{' '}
                     {orderData?.order?.created_at.substr(0, 16) || 'N/A'}
                  </StyledSpan>
                  <StyledSpan>Deliverd on: N/A</StyledSpan>
                  <StyledSpan>
                     Channel:
                     {capitalizeString(
                        orderData?.order?.channel?.cartSource || 'N/A'
                     )}
                  </StyledSpan>
               </StyledDiv>
               <StyledTable>
                  <ReactTabulator
                     columns={columns}
                     data={data}
                     ref={tableRef}
                     options={{
                        ...options,
                        placeholder: 'No Products Available Yet !',
                     }}
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
                  onClick={() => openTunnel1(1)}
                  smallText="Check Payment Status"
               />
               {deliveryInfoCard}
            </StyledSideBar>
         </StyledContainer>
         <OrderStatusTunnel
            tunnels={tunnels}
            openTunnel={openTunnel}
            closeTunnel={closeTunnel}
         />
         <PaymentStatusTunnel
            tunnels={tunnels1}
            openTunnel={openTunnel1}
            closeTunnel={closeTunnel1}
         />
      </StyledWrapper>
   )
}

export default OrderInfo
