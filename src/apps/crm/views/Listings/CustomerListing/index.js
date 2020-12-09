import React, { useRef, useState, useEffect, useContext } from 'react'
import { Text, Loader, Flex, IconButton } from '@dailykit/ui'
import { useSubscription, useQuery, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { useLocation } from 'react-router-dom'
import { useTabs } from '../../../context'
import { StyledWrapper } from './styled'
import { HeadingTile } from '../../../components'
import BrandContext from '../../../context/Brand'
import {
   CUSTOMERS_COUNT,
   TOTAL_REVENUE,
   CUSTOMERS_LISTING,
   CUSTOMER_ARCHIVED,
} from '../../../graphql'
import { Tooltip, InlineLoader } from '../../../../../shared/components'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { useTooltip } from '../../../../../shared/providers'
import { currencyFmt, logger } from '../../../../../shared/utils'
import options from '../../tableOptions'
import { toast } from 'react-toastify'

const CustomerListing = () => {
   const location = useLocation()
   const [context, setContext] = useContext(BrandContext)
   const { addTab, tab } = useTabs()
   const { tooltip } = useTooltip()
   const tableRef = useRef(null)
   const [customersList, setCustomersList] = useState(undefined)
   const [customerCount, setCustomerCount] = useState(0)
   const [revenue, setRevenue] = useState(0)
   // Subscription
   const { loading, error1 } = useSubscription(TOTAL_REVENUE, {
      variables: {
         brandId: context.brandId,
      },
      onSubscriptionData: data => {
         setRevenue(
            data?.subscriptionData?.data?.ordersAggregate?.aggregate?.sum
               ?.amountPaid || 0
         )
      },
   })
   const { customerCountLoading, error2 } = useSubscription(CUSTOMERS_COUNT, {
      variables: {
         brandId: context.brandId,
      },
      onSubscriptionData: data => {
         setCustomerCount(
            data?.subscriptionData?.data?.customers_aggregate?.aggregate
               ?.count || 0
         )
      },
   })
   if (error1 || error2) {
      toast.error('Something went wrong !')
      logger(error1 || error2)
   }

   // Mutation
   const [deleteCustomer] = useMutation(CUSTOMER_ARCHIVED, {
      onCompleted: () => {
         toast.success('Customer deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Query
   const { loading: listloading } = useQuery(CUSTOMERS_LISTING, {
      variables: {
         brandId: context.brandId,
      },
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
         addTab('Customers', location.pathname)
      }
   }, [addTab, tab])

   // Handler
   const deleteHandler = (e, Customer) => {
      console.log(Customer)
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete Customer - ${Customer.name}?`
         )
      ) {
         deleteCustomer({
            variables: {
               keycloakId: Customer.keycloakId,
            },
         })
      }
   }

   const rowClick = (e, cell) => {
      const { keycloakId, name } = cell._cell.row.data
      const param = `${location.pathname}/${keycloakId}`
      addTab(name, param)
   }

   const DeleteButton = () => {
      return (
         <IconButton type="ghost">
            <DeleteIcon color="#FF5A52" />
         </IconButton>
      )
   }

   const columns = [
      {
         title: 'Customer Name',
         field: 'name',
         headerFilter: true,
         hozAlign: 'left',
         cssClass: 'rowClick',
         cellClick: (e, cell) => {
            rowClick(e, cell)
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Phone',
         field: 'phone',
         headerFilter: true,
         hozAlign: 'right',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_phone_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
         hozAlign: 'left',
         headerTooltip: function (column) {
            const identifier = 'customer_listing_email_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Source',
         field: 'source',
         hozAlign: 'left',
         width: '150',
         headerTooltip: function (column) {
            const identifier = 'customer_listing_source_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Referrals Sent',
         field: 'refSent',
         hozAlign: 'right',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_referrals_sent_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
      },
      {
         width: 150,
         title: 'Total Paid',
         field: 'paid',
         hozAlign: 'right',
         titleFormatter: function (cell) {
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_paid_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         formatter: cell => currencyFmt(Number(cell.getValue()) || 0),
      },
      {
         title: 'Total Orders',
         field: 'orders',
         hozAlign: 'right',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_orders_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
      },
      {
         title: 'Discounts availed',
         field: 'discounts',
         hozAlign: 'right',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'customer_listing_discount_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
         formatter: cell => currencyFmt(Number(cell.getValue()) || 0),
      },
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteButton />),
         hozAlign: 'center',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   if (loading || customerCountLoading || listloading) return <InlineLoader />
   return (
      <StyledWrapper>
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            padding="32px 0 0 0"
         >
            <HeadingTile title="Total Customers" value={customerCount} />
            <HeadingTile
               title="Total Revenue generated"
               value={currencyFmt(revenue)}
            />
         </Flex>

         <Flex container height="80px" alignItems="center">
            <Text as="title">
               Customers(
               {customerCount})
            </Text>
            <Tooltip identifier="customer_list_heading" />
         </Flex>

         {Boolean(customersList) && (
            <ReactTabulator
               columns={columns}
               data={customersList}
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
