/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
/* eslint-disable import/imports-first */
/* eslint-disable import/order */
import React, { useState, useEffect } from 'react'
import { Text, Loader } from '@dailykit/ui'
import { useTabs } from '../../../context'
import { useQuery } from '@apollo/react-hooks'
import { CUSTOMER_DATA } from '../../../graphql'
import { useHistory } from 'react-router-dom'
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
import { OrdersTable, ReferralTable, WalletTable } from '../../index'
import { UpperCase } from '../Utils'

const CustomerRelation = props => {
   const { addTab, dispatch, tab } = useTabs()
   const history = useHistory()
   // const [activeCard, setActiveCard] = useState('Orders')
   const { loading: listLoading, data: customerData } = useQuery(
      CUSTOMER_DATA,
      {
         variables: {
            keycloakId: props.match.params.id,
         },
      }
   )
   useEffect(() => {
      if (!tab) {
         history.push('/crm/customers')
      }
   }, [history, tab])

   console.log(tab)

   const setActiveCard = card => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab?.path,
            data: { activeCard: card },
         },
      })
   }

   useEffect(() => {
      setActiveCard('Orders')
   }, [])

   let table = null
   if (tab?.data?.activeCard === 'Orders') {
      table = <OrdersTable id={props.match.params.id} />
   } else if (tab?.data?.activeCard === 'Referrals') {
      table = <ReferralTable />
   } else if (tab?.data?.activeCard === 'Wallet') {
      table = <WalletTable />
   }
   if (listLoading) return <Loader />
   return (
      <StyledWrapper>
         <StyledContainer>
            <StyledSideBar>
               {/* <StyledDiv> */}
               <CustomerCard
                  CustomerName={`${
                     customerData?.customer?.platform_customer?.firstName || ''
                  } ${
                     customerData?.customer?.platform_customer?.lastName ||
                     'N/A'
                  }`}
                  CustomerInfo={`Source: ${
                     UpperCase(customerData?.customer?.source) || ''
                  }`}
                  WalletAmount="N/A"
               />
               <ContactInfoCard
                  defaultTag="(Default)"
                  email={
                     customerData?.customer?.platform_customer?.email || 'N/A'
                  }
                  phone={
                     customerData?.customer?.platform_customer?.phoneNumber ||
                     'N/A'
                  }
                  address={`${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.line1 || ''
                  }, ${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.line2 || ''
                  }, ${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.city || ''
                  }, ${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.zipcode || ''
                  }, ${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.state || ''
                  }, ${
                     customerData?.customer?.platform_customer
                        ?.defaultCustomerAddress?.country || 'N/A'
                  }`}
               />
               <PaymentCard
                  defaultTag="(Default)"
                  cardNumber={`XXXX XXXX XXXX ${
                     customerData?.customer?.platform_customer
                        ?.defaultStripePaymentMethod?.last4 || 'XXXX'
                  }`}
                  cardDate={`${
                     customerData?.customer?.platform_customer
                        ?.defaultStripePaymentMethod?.expMonth || 'N'
                  }/${
                     customerData?.customer?.platform_customer
                        ?.defaultStripePaymentMethod?.expYear || 'A'
                  }`}
                  billingAddDisplay="none"
               />
               {/* </StyledDiv> */}
            </StyledSideBar>
            <StyledMainBar>
               <StyledContainer>
                  <StyledCard
                     heading="Orders"
                     subheading1="Total Amount"
                     value1={`$ ${
                        customerData?.customer?.orders_aggregate?.aggregate?.sum
                           ?.amountPaid || 'N/A'
                     }`}
                     subheading2="Total Orders"
                     value2={
                        customerData?.customer?.orders_aggregate?.aggregate
                           ?.count || 'N/A'
                     }
                     click={() => setActiveCard('Orders')}
                     active={tab.data.activeCard}
                  />

                  <StyledCard
                     heading="Referrals"
                     subheading1="Total Referrals Sent"
                     value1="N/A"
                     subheading2="Total Signed up"
                     value2="N/A"
                     click={() => setActiveCard('Referrals')}
                     active={tab.data.activeCard}
                  />
                  <StyledCard
                     heading="Wallet"
                     subheading1="Total Wallet Amount"
                     value1="N/A"
                     click={() => setActiveCard('Wallet')}
                     active={tab.data.activeCard}
                  />
               </StyledContainer>
               <StyledTable>{table}</StyledTable>
            </StyledMainBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default CustomerRelation
