import React, { useRef, useState, useEffect } from 'react'
import { Text, ButtonGroup, IconButton, PlusIcon, Loader } from '@dailykit/ui'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { HeadingTile } from '../../../components'
import tableOptions from '../tableOptions'
import {
   CUSTOMERS_COUNT,
   TOTAL_REVENUE,
   CUSTOMERS_LISTING,
} from '../../../graphql'

const CustomerListing = () => {
   const { addTab, tab } = useTabs()
   const tableRef = useRef(null)
   const [customersList, setCustomersList] = useState([])

   // Subscription
   const { data: totalRevenue, loading } = useSubscription(TOTAL_REVENUE)
   const { data: customersCount, customerCountLoading } = useSubscription(
      CUSTOMERS_COUNT
   )

   // Query
   const { loading: listloading } = useQuery(CUSTOMERS_LISTING, {
      onCompleted: ({ customers = {} }) => {
         const result = customers.map(customer => {
            return {
               keycloakId: customer.keycloakId,
               name: `${customer?.platform_customer?.firstName || ''} ${
                  customer?.platform_customer?.lastName || 'N/A'
               }`,
               phone: customer?.platform_customer?.phoneNumber || 'N/A',
               email: customer?.platform_customer?.email || 'N/A',
               source: customer.source || 'N/A',
               refSent: '20',
               paid:
                  customer?.orders_aggregate?.aggregate?.sum?.amountPaid ||
                  'N/A',
               orders: customer?.orders_aggregate?.aggregate?.count || 'N/A',
               discounts:
                  customer?.orders_aggregate?.aggregate?.sum?.discount || 'N/A',
            }
         })
         setCustomersList(result)
      },
   })

   useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/customers')
      }
   }, [addTab, tab])

   useEffect(() => {
      if (tableRef.current) {
         tableRef.current.table.setData(customersList)
      }
   })

   const rowClick = (e, row) => {
      const { keycloakId, name } = row._row.data
      const param = '/crm/customers/'.concat(keycloakId)
      addTab(name, param)
   }
   const columns = [
      { title: 'Customer Name', field: 'name', headerFilter: true },
      { title: 'Phone', field: 'phone', headerFilter: true },
      { title: 'Email', field: 'email', headerFilter: true },
      { title: 'Source', field: 'source' },
      { title: 'Referrals Sent', field: 'refSent' },
      { title: 'Total Paid', field: 'paid' },
      { title: 'Total Orders', field: 'orders' },
      { title: 'Discounts availed', field: 'discounts' },
   ]

   if (loading) return <Loader />
   if (customerCountLoading) return <Loader />
   if (listloading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="1fr 1fr">
            <HeadingTile
               title="Total Customers"
               value={
                  customersCount?.customers_aggregate?.aggregate?.count || '...'
               }
            />
            <HeadingTile
               title="Total Revenue generated"
               value={'$'.concat(
                  totalRevenue?.ordersAggregate?.aggregate?.sum?.amountPaid ||
                     '...'
               )}
            />
         </StyledHeader>
         <StyledHeader gridCol="10fr 1fr 0fr">
            <Text as="title">
               Customers(
               {customersCount?.customers_aggregate?.aggregate?.count || '...'})
            </Text>
            <Text as="subtitle">
               {`10 of ${
                  customersCount?.customers_aggregate?.aggregate?.count || '...'
               }`}
            </Text>
            <ButtonGroup>
               <IconButton type="solid">
                  <PlusIcon />
               </IconButton>
            </ButtonGroup>
         </StyledHeader>

         <ReactTabulator
            columns={columns}
            data={customersList}
            rowClick={rowClick}
            options={tableOptions}
            ref={tableRef}
         />
      </StyledWrapper>
   )
}

export default CustomerListing
