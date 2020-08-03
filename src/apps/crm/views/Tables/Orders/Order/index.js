/* eslint-disable react/jsx-fragments */
import React from 'react'
import { Text, Avatar } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   StyledCard,
} from '../../../../components'
import {
   StyledWrapper,
   StyledContainer,
   StyledSideBar,
   StyledMainBar,
   StyledTable,
   StyledDiv,
   SideCard,
   Card,
   CardInfo,
} from './styled'
// import { useTabs } from '../../../../context'

const OrderInfo = props => {
   //    const { addTab } = useTabs()
   const columns = [
      { title: 'Order Id', field: 'id', headerFilter: true },
      { title: 'Products', field: 'products' },
      { title: 'Wallet Used', field: 'walletUsed' },
      { title: 'Discount', field: 'discount' },
      { title: 'Total Paid', field: 'paid' },
   ]
   const data = [
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
      },
      {
         id: '#134233445',
         products: '3',
         walletUsed: '$1.22',
         discount: '$1',
         paid: '8',
      },
   ]
   //    const rowClick = (e, row) => {
   //       const { id, name } = row._row.data

   //       const param = '/crm/customers/'.concat(name)
   //       addTab(name, param)
   //    }
   return (
      <StyledWrapper>
         <span style={{ margin: '16px' }}>
            <a href="/">Orders</a> #134455234
         </span>
         <Text as="h1">#134455234</Text>
         <StyledContainer>
            <StyledMainBar>
               <StyledDiv>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                        borderRight: '1px solid #ececec',
                     }}
                  >
                     Ordered on: Feb 20,2020,15:00
                  </div>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                        borderRight: '1px solid #ececec',
                     }}
                  >
                     Deliverd on: Feb 20,2020,17:00
                  </div>
                  <div
                     style={{
                        padding: '0 30px 16px 30px',
                     }}
                  >
                     Channel:RMK
                  </div>
               </StyledDiv>
               <StyledTable>
                  <ReactTabulator
                     columns={columns}
                     data={data}
                     // rowClick={rowClick}
                     // options={tableOptions}
                  />
                  <CardInfo>
                     <Text as="title">Total</Text>
                     <Text as="title">$18.56</Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Overall Discount</Text>
                     <Text as="title">$0</Text>
                  </CardInfo>
                  <CardInfo>
                     <Text as="title">Wallet Used</Text>
                     <Text as="title">$3.6</Text>
                  </CardInfo>
                  <CardInfo bgColor="#f3f3f3">
                     <Text as="h2">Wallet Used</Text>
                     <Text as="h2">$16.96</Text>
                  </CardInfo>
               </StyledTable>
            </StyledMainBar>
            <StyledSideBar>
               <PaymentCard
                  cardNumber="XXXX XXXX XXXX XXXX"
                  cardDate="MM/YYYY"
                  cardCVV="012"
                  address="ABC Building No. 123 first floor sector - x, unknow street "
                  bgColor="rgba(243,243,243,0.4)"
                  margin="0 0 16px 0"
               />
               <SideCard>
                  <Text as="subtitle">Invoice Sent To:</Text>
                  <Text as="title">johndoe@gmail.com</Text>
               </SideCard>
               <SideCard>
                  <Text as="subtitle">Delivery Partner:</Text>
                  <Card>
                     <Avatar
                        withName
                        type="round"
                        title="John Doe"
                        url="https://randomuser.me/api/portraits/men/61.jpg"
                     />
                     <CardInfo bgColor="rgba(243, 243, 243, 0.4)">
                        <Text as="p">Total Paid:</Text>
                        <Text as="p">$1.4</Text>
                     </CardInfo>
                  </Card>
               </SideCard>
            </StyledSideBar>
         </StyledContainer>
      </StyledWrapper>
   )
}

export default OrderInfo
