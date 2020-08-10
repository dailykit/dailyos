/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
/* eslint-disable import/imports-first */
/* eslint-disable import/order */
import React, { useState, useEffect } from 'react'
import { Text, Loader, useTunnel } from '@dailykit/ui'
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
import { Capitalize } from '../Utils'
import { PaymentTunnel, AddressTunnel } from './Tunnel'

const CustomerRelation = props => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [tunnels1, openTunnel1, closeTunnel1] = useTunnel(1)
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
                     Capitalize(customerData?.customer?.source) || ''
                  }`}
                  WalletAmount="N/A"
               />
               <ContactInfoCard
                  defaultTag2="(Default)"
                  customerData={customerData?.customer?.platform_customer}
                  onClick={() => openTunnel1(1)}
               />
               <PaymentCard
                  defaultTag="(Default)"
                  linkedTo="view all cards"
                  onClick={() => openTunnel(1)}
                  cardData={
                     customerData?.customer?.platform_customer
                        ?.defaultStripePaymentMethod || 'N/A'
                  }
                  billingAddDisplay="none"
               />
               {/* </StyledDiv> */}
            </StyledSideBar>
            <StyledMainBar>
               <StyledContainer>
                  <StyledCard
                     heading="Orders"
                     subheading1="Total Amount"
                     data={customerData?.customer?.orders_aggregate?.aggregate}
                     subheading2="Total Orders"
                     click={() => setActiveCard('Orders')}
                     active={tab.data.activeCard}
                  />

                  <StyledCard
                     heading="Referrals"
                     subheading1="Total Referrals Sent"
                     subheading2="Total Signed up"
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

         <PaymentTunnel
            tunnels={tunnels}
            openTunnel={openTunnel}
            closeTunnel={closeTunnel}
            id={props.match.params.id}
         />
         <AddressTunnel
            tunnels={tunnels1}
            openTunnel={openTunnel1}
            closeTunnel={closeTunnel1}
            id={props.match.params.id}
         />
      </StyledWrapper>
   )
}

export default CustomerRelation
