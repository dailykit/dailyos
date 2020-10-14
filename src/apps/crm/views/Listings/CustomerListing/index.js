import React, { useRef, useState, useEffect } from 'react'
import { Text, Loader, Flex } from '@dailykit/ui'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { HeadingTile } from '../../../components'
import {
   CUSTOMERS_COUNT,
   TOTAL_REVENUE,
   CUSTOMERS_LISTING,
} from '../../../graphql'
import { Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import options from '../../tableOptions'
import { toast } from 'react-toastify'

const CustomerListing = () => {
   const { addTab, tab } = useTabs()
   const tableRef = useRef(null)
   const [customersList, setCustomersList] = useState(undefined)

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
      onError: error => {
         toast.error('Something went wrong !')
         logger(error)
      },
   })

   useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/customers')
      }
   }, [addTab, tab])

   const rowClick = (e, row) => {
      const { keycloakId, name } = row._row.data
      const param = '/crm/customers/'.concat(keycloakId)
      addTab(name, param)
   }
   const columns = [
      {
         title: 'Customer Name',
         field: 'name',
         headerFilter: true,
         hozAlign: 'left',
      },
      {
         title: 'Phone',
         field: 'phone',
         headerFilter: true,
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 100,
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
         hozAlign: 'left',
      },
      { title: 'Source', field: 'source', hozAlign: 'left', width: '150' },
      {
         title: 'Referrals Sent',
         field: 'refSent',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Total Paid',
         field: 'paid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Total Orders',
         field: 'orders',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Discounts availed',
         field: 'discounts',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   if (loading) return <Loader />
   if (customerCountLoading) return <Loader />
   if (listloading) return <Loader />
   return (
      <StyledWrapper>
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            padding="32px 0 0 0"
         >
            <HeadingTile
               title="Total Customers"
               value={
                  customersCount?.customers_aggregate?.aggregate?.count || 0
               }
            />
            <HeadingTile
               title="Total Revenue generated"
               value={'$'.concat(
                  totalRevenue?.ordersAggregate?.aggregate?.sum?.amountPaid || 0
               )}
            />
         </Flex>

         <Flex container height="80px" alignItems="center">
            <Text as="title">
               Customers(
               {customersCount?.customers_aggregate?.aggregate?.count || 0})
            </Text>
            <Tooltip identifier="customer_list_heading" />
         </Flex>

         {Boolean(customersList) && (
            <ReactTabulator
               columns={columns}
               data={customersList}
               rowClick={rowClick}
               options={{
                  ...options,
                  placeholder: 'No Customers Available Yet !',
               }}
               ref={tableRef}
            />
         )}
      </StyledWrapper>
   )
}

export default CustomerListing
