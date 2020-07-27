/* eslint-disable no-console */
import React from 'react'
import { Text, ButtonGroup, IconButton, PlusIcon } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import { HeadingTile } from '../../../components'
import { CUSTOMERS_COUNT, TOTAL_REVENUE } from '../../../graphql'

const CustomerListing = () => {
   const { addTab } = useTabs()
   const { data: customersCount } = useSubscription(CUSTOMERS_COUNT)
   const { data: totalRevenue } = useSubscription(TOTAL_REVENUE)
   const rowClick = (e, row) => {
      const { id, name } = row._row.data

      const param = '/crm/customers/'.concat(name)
      addTab(name, param)
   }
   const columns = [
      { title: 'Customer Name', field: 'name', headerFilter: true },
      { title: 'Lead Type', field: 'leadType' },
      { title: 'Referrals Sent', field: 'refSent' },
      { title: 'Total Paid', field: 'paid' },
      { title: 'Total Orders', field: 'orders' },
      { title: 'Sales Channels', field: 'sales' },
      { title: 'Discounts availed', field: 'discounts' },
   ]
   const data = []
   if (customersCount) {
      customersCount.customers_aggregate.nodes.map((order, index) => {
         const ordersCount = order.orders_aggregate.aggregate.count
         const totalPaid = order.orders_aggregate.aggregate.sum.amountPaid
         return data.push({
            name: 'John Doe'.concat(index + 1),
            leadType: 'Organic'.concat(index + 1),
            refSent: '20',
            paid: totalPaid !== null ? totalPaid : 0,
            orders: ordersCount,
            sales: '20',
            discounts: '20',
         })
      })
   }
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

         {/* <StyledHeader gridCol="5fr 1fr 2fr ">
            <Text as="title">
               <SlidersIcon size="18" color="#555b6e" /> Filters
            </Text>
            <Dropdown
               type="single"
               options={options}
               searchedOption={searchedOption}
               selectedOption={selectedOption}
               placeholder="Last updates"
            />

            <ButtonGroup align="right">
               <SearchBox
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
               <IconButton type="solid">
                  <PlusIcon />
               </IconButton>
            </ButtonGroup>
         </StyledHeader> */}

         {/* <Table>
            <TableHead>
               <TableRow>
                  <TableCell>
                     <Checkbox
                        id="label"
                        checked={checked}
                        onChange={setChecked}
                     />
                  </TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Lead Type</TableCell>
                  <TableCell>Referrals Sent</TableCell>
                  <TableCell>Total Paid</TableCell>
                  <TableCell>Total Orders</TableCell>
                  <TableCell>Sales Channels</TableCell>
                  <TableCell>Discount Availed</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {customersCount?.customers_aggregate.nodes.map(customer => {
                  console.log(customer)
               })}
               <TableRow>
                  <TableCell>
                     <Checkbox
                        id="label"
                        checked={checked}
                        onChange={setChecked}
                     />
                  </TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Organic</TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>$ 123.4</TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>
                     <Checkbox
                        id="label"
                        checked={checked}
                        onChange={setChecked}
                     />
                  </TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Referral</TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>$ 1200</TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
                  <TableCell>
                     <CircularSpan>20</CircularSpan>
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table> */}
      </StyledWrapper>
   )
}

export default CustomerListing
