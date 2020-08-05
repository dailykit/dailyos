/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import React from 'react'
import { Text, ButtonGroup, IconButton, PlusIcon, Loader } from '@dailykit/ui'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { HeadingTile } from '../../../components'
import { CUSTOMERS_COUNT, TOTAL_REVENUE, CUSTOMERS_DATA } from '../../../graphql'

const CustomerListing = () => {
   const { addTab } = useTabs()
   const { data: customersCount } = useSubscription(CUSTOMERS_COUNT)
   const { loading: listLoading, data: customerData } = useQuery(CUSTOMERS_DATA)
   // if (customerData) {
   //    console.log(customerData)
   // }
   const { data: totalRevenue } = useSubscription(TOTAL_REVENUE)
   const rowClick = (e, row) => {
      const { keycloakId, name } = row._row.data
      const param = '/crm/customers/'.concat(keycloakId)
      addTab(name, param)
   }
   const columns = [
      { title: 'Customer Name', field: 'name', headerFilter: true },
      { title: 'Source', field: 'source' },
      { title: 'Referrals Sent', field: 'refSent' },
      { title: 'Total Paid', field: 'paid' },
      { title: 'Total Orders', field: 'orders' },
      { title: 'Discounts availed', field: 'discounts' },
   ]
   const data = []
   if (customerData) {

      customerData.customers.map(customer => {
         const key = customer.keycloakId
         const source = customer.source
         const firstName = customer.platform_customer
            ? customer.platform_customer.firstName
            : ' N/A'
         const lastName = customer.platform_customer
            ? customer.platform_customer.lastName
            : ' '
         const fullName =
            firstName && lastName ? firstName.concat(' ') + lastName : 'N/A'
         const {
            count,
            sum: { amountPaid, discount },
         } = customer.orders_aggregate.aggregate
         return data.push({
            keycloakId: key,
            name: fullName,
            source,
            refSent: '20',
            paid: amountPaid !== null ? amountPaid : 0,
            orders: count,
            discounts: discount || 0,
         })
      })
   }
   if (listLoading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="1fr 1fr">
            <HeadingTile
               title="Total Customers"
               value={
                  customersCount?.customers_aggregate.aggregate.count ||
                  'Loading...'
               }
            />
            <HeadingTile
               title="Total Revenue generated"
               value={'$'.concat(
                  totalRevenue?.ordersAggregate.aggregate.sum.amountPaid ||
                     'Loading...'
               )}
            />
         </StyledHeader>
         <StyledHeader gridCol="10fr 1fr 0fr">
            <Text as="title">
               Customers(
               {customersCount?.customers_aggregate.aggregate.count ||
                  'Loading...'}
               )
            </Text>
            <Text as="subtitle">
               10 of{' '}
               {customersCount?.customers_aggregate.aggregate.count ||
                  'Loading...'}
            </Text>
            <ButtonGroup>
               <IconButton type="solid">
                  <PlusIcon />
               </IconButton>
            </ButtonGroup>
         </StyledHeader>

         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            // options={tableOptions}
         />

         
      </StyledWrapper>
   )
}

export default CustomerListing
