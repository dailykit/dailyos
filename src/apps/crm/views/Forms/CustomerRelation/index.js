/* eslint-disable import/imports-first */
/* eslint-disable import/order */
import React from 'react'
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
import { reactFormatter, ReactTabulator } from 'react-tabulator'

const CustomerRelation = () => {
   const { addTab } = useTabs()
   const columns = [
      { title: 'Order Id', field: 'id', headerFilter: true },
      { title: 'Products', field: 'products' },
      { title: 'Wallet Used', field: 'walletUsed' },
      { title: 'Discount', field: 'discount' },
      { title: 'Total Paid', field: 'paid' },
      { title: 'Channel', field: 'channel' },
      { title: 'Ordered On', field: 'orderedOn' },
      { title: 'Delivered On', field: 'deliveredOn' },
   ]
   const data = [
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
         channel: 'RMK',
         orderedOn: 'Feb 20, 2020, 15:00',
         deliveredOn: 'Feb 20, 2020, 17:00',
      },
   ]
   const rowClick = (e, row) => {
      const { id, name } = row._row.data

      const param = '/crm/customers/'.concat(name)
      addTab(name, param)
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
               <StyledTable>
                  <div style={{ padding: '16px' }}>
                     <Text as="title">Orders(20)</Text>
                  </div>
                  <div style={{ overflowX: 'scroll' }}>
                     <ReactTabulator
                        columns={columns}
                        data={data}
                        rowClick={rowClick}
                        // options={tableOptions}
                     />
                  </div>
               </StyledTable>
            </StyledMainBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default CustomerRelation
