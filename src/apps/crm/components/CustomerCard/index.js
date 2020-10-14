import React from 'react'
import { Text, Avatar, Toggle, Flex } from '@dailykit/ui'
import {
   StyledCustomerCard,
   CustomerInfo,
   CustomerWallet,
   StyledDiv,
} from './styled'
import { capitalizeString } from '../../Utils'
import { Tooltip } from '../../../../shared/components'

const CustomerCard = ({ customer, walletAmount, toggle, toggleHandler }) => (
   <StyledCustomerCard>
      <CustomerInfo>
         <Avatar url="https://randomuser.me/api/portraits/men/61.jpg" />
         <Text as="p">{`${customer?.platform_customer?.firstName || 'N/A'} ${
            customer?.platform_customer?.lastName || 'N/A'
         }`}</Text>
         <Flex container alignItems="center">
            <Text as="p">{capitalizeString(customer?.source || 'N/A')}</Text>
            <Tooltip identifier="source_info" />
         </Flex>
      </CustomerInfo>
      <CustomerWallet>
         <Text as="p">Wallet amount</Text>
         <Text as="p">{walletAmount}</Text>
      </CustomerWallet>
      <StyledDiv>
         <Text as="p">Test Customer</Text>
         <Toggle checked={toggle} setChecked={toggleHandler} />
      </StyledDiv>
   </StyledCustomerCard>
)
export default CustomerCard
