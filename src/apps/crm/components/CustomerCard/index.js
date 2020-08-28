import React from 'react'
import { Text, Avatar, IconButton, PlusIcon, Toggle } from '@dailykit/ui'
import {
   StyledCustomerCard,
   CustomerInfo,
   CustomerWallet,
   StyledDiv,
} from './styled'
import { capitalizeString } from '../../Utils'

const CustomerCard = ({ customer, walletAmount, toggle, toggleHandler }) => (
   <StyledCustomerCard>
      <CustomerInfo>
         <Avatar url="https://randomuser.me/api/portraits/men/61.jpg" />
         <Text as="title">{`${
            customer?.platform_customer?.firstName || 'N/A'
         } ${customer?.platform_customer?.lastName || 'N/A'}`}</Text>
         <Text as="subtitle">
            {capitalizeString(customer?.source || 'N/A')}
         </Text>
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
      <StyledDiv>
         <Text as="subtitle">Test Customer</Text>
         <Toggle checked={toggle} setChecked={toggleHandler} />
      </StyledDiv>
   </StyledCustomerCard>
)
export default CustomerCard
