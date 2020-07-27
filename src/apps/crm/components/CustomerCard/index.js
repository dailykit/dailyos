/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text, Avatar, IconButton, PlusIcon } from '@dailykit/ui'
import { CustomerCard, CustomerInfo, CustomerWallet } from './styled'

const customerCard = props => (
   <CustomerCard>
      <CustomerInfo>
         <Avatar url="https://randomuser.me/api/portraits/men/61.jpg" />
         <Text as="title">{props.CustomerName}</Text>
         <Text as="subtitle">{props.CustomerInfo}</Text>
      </CustomerInfo>
      <CustomerWallet>
         <span>
            <Text as="subtitle">Wallet amount</Text>
            <Text as="title">{props.WalletAmount}</Text>
         </span>
         <IconButton type="solid">
            <PlusIcon />
         </IconButton>
      </CustomerWallet>
   </CustomerCard>
)
export default customerCard
