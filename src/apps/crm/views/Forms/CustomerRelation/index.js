import React from 'react'
import { Avatar, Text, IconButton, PlusIcon } from '@dailykit/ui'
import { StyledWrapper, StyledContainer, StyledDiv } from './styled'
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   StyledCard,
} from '../../../components'

const customerRelation = () => {
   return (
      <StyledWrapper>
         <StyledContainer>
            <StyledDiv>
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
            </StyledDiv>
            <StyledDiv>
               <StyledContainer>
                  <StyledCard
                     heading="Revenue and Sales"
                     subheading1="Total Amount"
                     value1="$123.43"
                     subheading2="Total Orders"
                     value2="20"
                  />
                  <StyledCard
                     heading="Referrals"
                     subheading1="Total Referrals Sent"
                     value1="10"
                     subheading2="Total Signed up"
                     value2="3"
                  />
                  <StyledCard
                     heading="Wallet"
                     subheading1="Total Wallet Amount"
                     value1="$12.3"
                  />
               </StyledContainer>
            </StyledDiv>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default customerRelation
