/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
/* eslint-disable import/imports-first */
/* eslint-disable import/order */
import React, { useState } from 'react'
import { Text,Loader } from '@dailykit/ui'
import { useTabs } from '../../../context'
import {
   StyledWrapper,
   StyledContainer,
   StyledSideBar,
   StyledMainBar,
   StyledTable,
} from './styled'
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   StyledCard,
} from '../../../components'
// import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { OrdersTable, ReferralTable, WalletTable } from '../../index'
import {CUSTOMER} from '../../../graphql'

const CustomerRelation = (props) => {
   const { addTab } = useTabs()
   const { loading: listLoading, data: customerData } = useQuery(CUSTOMER, {
      variables: {
         keycloakId: props.match.params.id
      }})
   let fullName = "N/A";
   let email = "N/A";
   let phone = "N/A";
   let source = "N/A";
   let cardBrand = "N/A";
   let cardNumber = "XXXX XXXX XXXX XXXX";
   let expireDate = "N/A";
   let deliveryAddress = "N/A";
   let count = "N/A";
   let totalAmount = "N/A";
   let orders = [];
   if(customerData &&  customerData.customer.platform_customer!==null){
      console.log(customerData);

      const firstName = customerData.customer.platform_customer
      ? customerData.customer.platform_customer.firstName
      : ' N/A'
   const lastName = customerData.customer.platform_customer
   ? customerData.customer.platform_customer.lastName
   : ' N/A'
    fullName =
   firstName && lastName ? firstName.concat(' ') + lastName : 'N/A'
    email =  customerData.customer.platform_customer.email || "N/A";
    phone = customerData.customer.platform_customer.phoneNumber || "";
    source = customerData.customer.source || "";
    cardBrand = customerData.customer.platform_customer.defaultStripePaymentMethod?customerData.customer.platform_customer.defaultStripePaymentMethod.brand : "";
    const last4 = customerData.customer.platform_customer.defaultStripePaymentMethod?customerData.customer.platform_customer.defaultStripePaymentMethod.last4 : "";
    cardNumber = `XXXX XXXX XXXX ${last4}`
    const expMonth = customerData.customer.platform_customer.defaultStripePaymentMethod?customerData.customer.platform_customer.defaultStripePaymentMethod.expMonth: "N";
    const expYear = customerData.customer.platform_customer.defaultStripePaymentMethod?customerData.customer.platform_customer.defaultStripePaymentMethod.expYear: "A";
    expireDate = `${expMonth}/${expYear}`
    const line1 = customerData.customer.platform_customer.defaultCustomerAddress? customerData.customer.platform_customer.defaultCustomerAddress.line1 : "";
    const line2 =  customerData.customer.platform_customer.defaultCustomerAddress?customerData.customer.platform_customer.defaultCustomerAddress.line2 : "";
    const city =  customerData.customer.platform_customer.defaultCustomerAddress?customerData.customer.platform_customer.defaultCustomerAddress.city : "";
    const state =  customerData.customer.platform_customer.defaultCustomerAddress?customerData.customer.platform_customer.defaultCustomerAddress.state : "";
    const zipcode =  customerData.customer.platform_customer.defaultCustomerAddress?customerData.customer.platform_customer.defaultCustomerAddress.zipcode :"";
    const country =  customerData.customer.platform_customer.defaultCustomerAddress?customerData.customer.platform_customer.defaultCustomerAddress.country : "";
    deliveryAddress = line1 || line2 ? `${line1}, ${line2}, ${city}, ${state}, ${zipcode}, ${country}`:"N/A" ;
    count = customerData.customer.orders_aggregate?customerData.customer.orders_aggregate.aggregate.count :"0";
    totalAmount = customerData.customer.orders_aggregate?customerData.customer.orders_aggregate.aggregate.sum.amountPaid : "0";
    orders = customerData.customer.orders?customerData.orders : [];
}
   const [activeCard, setActiveCard] = useState('Orders')
   let table = null
   if (activeCard === 'Orders') {
      table = <OrdersTable id = {props.match.params.id} count={count} />
   } else if (activeCard === 'Referrals') {
      table = <ReferralTable />
   } else if (activeCard === 'Wallet') {
      table = <WalletTable />
   }
   if (listLoading) return <Loader />
   return (
      <StyledWrapper>
         <StyledContainer>
            <StyledSideBar>
               {/* <StyledDiv> */}
               <CustomerCard
                  CustomerName={fullName}
                  CustomerInfo={`Source: ${source.charAt(0).toUpperCase() + source.slice(1)}`}
                  WalletAmount="N/A"
               />
               <ContactInfoCard
                  email={email}
                  phone={phone}
                  address={deliveryAddress}
               />
               <PaymentCard
                  cardNumber={cardNumber}
                  cardDate={expireDate}
                  address={deliveryAddress}
               />
               {/* </StyledDiv> */}
            </StyledSideBar>
            <StyledMainBar>
               <StyledContainer>
                  <StyledCard
                     heading="Orders"
                     subheading1="Total Amount"
                     value1={totalAmount!==null?`$ ${totalAmount}`:"$ 0"}
                     subheading2="Total Orders"
                     value2={count}
                     click={() => setActiveCard('Orders')}
                     active={activeCard}
                  />

                  <StyledCard
                     heading="Referrals"
                     subheading1="Total Referrals Sent"
                     value1="N/A"
                     subheading2="Total Signed up"
                     value2="N/A"
                     click={() => setActiveCard('Referrals')}
                     active={activeCard}
                  />
                  <StyledCard
                     heading="Wallet"
                     subheading1="Total Wallet Amount"
                     value1="N/A"
                     click={() => setActiveCard('Wallet')}
                     active={activeCard}
                  />
               </StyledContainer>
               <StyledTable>{table}</StyledTable>
            </StyledMainBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default CustomerRelation
