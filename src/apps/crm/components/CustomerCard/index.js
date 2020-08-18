import React from 'react'
import { Text, Avatar, IconButton, PlusIcon } from '@dailykit/ui'
import { StyledCustomerCard, CustomerInfo, CustomerWallet } from './styled'

const CustomerCard = ({ customer, walletAmount }) => (
   <StyledCustomerCard>
      <CustomerInfo>
         <Avatar url="https://randomuser.me/api/portraits/men/61.jpg" />
         <Text as="title">{`${
            customer?.platform_customer?.firstName || 'N/A'
         } ${customer?.platform_customer?.lastName || 'N/A'}`}</Text>
         <Text as="subtitle">{customer?.source}</Text>
      </CustomerInfo>
      <CustomerWallet>
         <span>
            <Text as="subtitle">Wallet amount</Text>
            <Text as="title">{walletAmount}</Text>
         </span>
         <IconButton type="solid">
            <PlusIcon />
         </IconButton>
      </CustomerWallet>
   </StyledCustomerCard>
)
export default CustomerCard
