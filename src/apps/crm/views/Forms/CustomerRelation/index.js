/* eslint-disable import/no-cycle */
/* eslint-disable import/imports-first */
/* eslint-disable import/order */
import React, { useState } from 'react'
import { Text } from '@dailykit/ui'
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

import { OrdersTable, ReferralTable, WalletTable } from '../../index'

const CustomerRelation = () => {
   const { addTab } = useTabs()
   const [activeCard, setActiveCard] = useState('Orders')
   let table = null
   if (activeCard === 'Orders') {
      table = <OrdersTable />
   } else if (activeCard === 'Referrals') {
      table = <ReferralTable />
   } else if (activeCard === 'Wallet') {
      table = <WalletTable />
   }
   return (
      <StyledWrapper>
         <StyledContainer>
            <StyledSideBar>
               {/* <StyledDiv> */}
               <CustomerCard
                  CustomerName="Phil Dunphey"
                  CustomerInfo="Lead Type: Organic"
                  WalletAmount="$120"
               />
               <ContactInfoCard
                  email="abc.xyz.com"
                  phone="+91 1234567890"
                  address="ABC Building No. 123 first floor sector - x, unknow street "
               />
               <PaymentCard
                  cardNumber="XXXX XXXX XXXX XXXX"
                  cardDate="MM/YYYY"
                  cardCVV="012"
                  address="ABC Building No. 123 first floor sector - x, unknow street "
               />
               {/* </StyledDiv> */}
            </StyledSideBar>
            <StyledMainBar>
               <StyledContainer>
                  <StyledCard
                     heading="Orders"
                     subheading1="Total Amount"
                     value1="$123.43"
                     subheading2="Total Orders"
                     value2="20"
                     click={() => setActiveCard('Orders')}
                     active={activeCard}
                  />

                  <StyledCard
                     heading="Referrals"
                     subheading1="Total Referrals Sent"
                     value1="10"
                     subheading2="Total Signed up"
                     value2="3"
                     click={() => setActiveCard('Referrals')}
                     active={activeCard}
                  />
                  <StyledCard
                     heading="Wallet"
                     subheading1="Total Wallet Amount"
                     value1="$12.3"
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
