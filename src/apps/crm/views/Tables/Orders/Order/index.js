import React, { useState, useContext, useRef } from 'react'
import { Text, Avatar, useTunnel, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { ORDER } from '../../../../graphql'
import { useTabs } from '../../../../context'
import { capitalizeString } from '../../../../Utils'
import { PaymentCard } from '../../../../components'
import { ChevronRight } from '../../../../../../shared/assets/icons'
import { Tooltip, InlineLoader } from '../../../../../../shared/components'
import { useTooltip } from '../../../../../../shared/providers'
import { toast } from 'react-toastify'
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
} from './styled'
import options from '../../../tableOptions'
import { currencyFmt, logger } from '../../../../../../shared/utils'
import BrandContext from '../../../../context/Brand'

const OrderInfo = () => {
   const [context, setContext] = useContext(BrandContext)
   const { dispatch, tab } = useTabs()
   const { tooltip } = useTooltip()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [tunnels1, openTunnel1, closeTunnel1] = useTunnel(1)
   const [products, setProducts] = useState(undefined)
   const tableRef = useRef()
   const { data: orderData, loading } = useQuery(ORDER, {
      variables: {
         orderId: tab.data.oid,
         brandId: context.brandId,
      },
      onCompleted: ({ brand: { brand_Orders = [] } = {} } = {}) => {
         const result = brand_Orders[0]?.orderCart?.cartInfo?.products.map(
            product => {
               return {
                  products: product?.name || 'N/A',
                  servings: product?.quantity || 'N/A',
                  discount: product.discount || 'N/A',
                  discountedPrice: product?.totalPrice || 'N/A',
               }
            }
         )
         setProducts(result)
      },
      onError: error => {
         toast.error('Something went wrong order')
         logger(error)
      },
   })

   const setOrder = (orderId, order) => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab.path,
            data: { oid: orderId, isOrderClicked: order },
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
            const identifier = 'product_listing_name_column'
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
            const identifier = 'product_listing_serving_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         widht: 100,
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
            const identifier = 'product_listing_discount_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         formatter: cell => currencyFmt(Number(cell.getValue()) || 0),
         widht: 100,
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
            const identifier = 'product_listing_discounted_price_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         formatter: cell => currencyFmt(Number(cell.getValue()) || 0),
         widht: 100,
      },
   ]

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
            <Flex container alignItems="center">
               <Text as="subtitle">Delivery Assign To:</Text>
               <Tooltip identifier="customer_order_delivery_agent" />
            </Flex>
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
                     {currencyFmt(
                        Number(orderData?.order?.deliveryFee?.value || 0)
                     )}
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
   if (loading) return <InlineLoader />
   return (
      <StyledWrapper>
         <Flex container alignItems="center" justifyContent="space-between">
            <StyledContainer>
               <StyledInput
                  type="button"
                  onClick={() => setOrder('', false)}
                  value="Orders"
               />
               <ChevronRight size="20" />
               <Text as="p">Order Id: #{tab.data.oid}</Text>
            </StyledContainer>
            <SmallText onClick={() => openTunnel(1)}>
               Check Order Status
            </SmallText>
         </Flex>
         <Flex container margin="0 0 0 6px" height="80px" alignItems="center">
            <Text as="h1">Order Id: #{tab.data.oid}</Text>
            <Tooltip identifier="product_list_heading" />
         </Flex>
         <StyledContainer>
            <StyledMainBar>
               <StyledDiv>
                  <StyledSpan>
                     Ordered on:
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
                  {Boolean(products) && (
                     <ReactTabulator
                        columns={columns}
                        data={products}
                        ref={tableRef}
                        options={{
                           ...options,
                           placeholder: 'No Order Available Yet !',
                        }}
                     />
                  )}
                  <CardInfo>
                     <Text as="title">Total</Text>
                     <Text as="title">
                        {currencyFmt(
                           Number(
                              orderData?.order?.orderCart?.cartInfo?.total || 0
                           )
                        )}
                     </Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Overall Discount</Text>
                     <Text as="title">
                        {currencyFmt(Number(orderData?.order?.discount || 0))}
                     </Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Wallet Used</Text>
                     <Text as="title">N/A</Text>
                  </CardInfo>
                  <CardInfo bgColor="#f3f3f3">
                     <Text as="h2">Total Paid</Text>
                     <Text as="h2">
                        {currencyFmt(Number(orderData?.order?.amountPaid || 0))}
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
                  identifier="payment_card_info"
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
