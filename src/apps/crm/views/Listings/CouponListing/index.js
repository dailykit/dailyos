import React from 'react'
import { Text, ButtonGroup, IconButton, PlusIcon, Toggle } from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from 'react-tabulator'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import tableOptions from '../tableOptions'
import { randomSuffix } from '../../../../../shared/utils'
import {
   COUPON_LISTING,
   COUPON_TOTAL,
   COUPON_ACTIVE,
   CREATE_COUPON,
} from '../../../graphql'

const CustomerListing = () => {
   const { addTab, tab } = useTabs()

   // Subscription
   const { data: couponListing } = useSubscription(COUPON_LISTING)
   const { data: couponTotal } = useSubscription(COUPON_TOTAL)

   // Mutation
   const [updateCouponActive] = useMutation(COUPON_ACTIVE, {
      onCompleted: () => {
         toast.info('Coupon Updated!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })
   const [createCoupon] = useMutation(CREATE_COUPON, {
      variables: {
         couponCode: `coupon-${randomSuffix()}`,
      },
      onCompleted: data => {
         addTab(data.createCoupon.code, `/crm/coupons/${data.createCoupon.id}`)
         toast.success('Coupon created!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/customers')
      }
   }, [addTab, tab])

   const toggleHandler = (toggle, id) => {
      updateCouponActive({
         variables: {
            couponId: id,
            isActive: toggle,
         },
      })
   }

   const ToggleButton = ({ cell }) => {
      const rowData = cell._cell.row.data
      return (
         <Toggle
            checked={rowData.active}
            setChecked={() => toggleHandler(!rowData.active, rowData.id)}
         />
      )
   }

   const rowClick = (e, row) => {
      const { id, code } = row._row.data
      const param = `/crm/coupons/${id}`
      const tabTitle = code
      addTab(tabTitle, param)
   }

   const columns = [
      { title: 'Coupon Code', field: 'code', headerFilter: true },
      { title: 'Used', field: 'used', headerFilter: true },
      { title: 'Conversion Rate', field: 'rate', headerFilter: true },
      { title: 'Amount Spent', field: 'amount' },
      {
         title: 'Active',
         field: 'active',
         formatter: reactFormatter(<ToggleButton />),
      },
      { title: 'Duration', field: 'duration' },
   ]
   const data = []
   if (couponListing) {
      couponListing.coupons.map(coupon => {
         return data.push({
            id: coupon?.id,
            code: coupon?.code,
            used: 'N/A',
            rate: 'N/A',
            amount: 'N/A',
            active: coupon?.isActive,
            duration: 'N/A',
         })
      })
   }
   return (
      <StyledWrapper>
         <StyledHeader gridCol="10fr  1fr">
            <Text as="title">
               Customers(
               {couponTotal?.couponsAggregate?.aggregate?.count || '...'})
            </Text>
            <ButtonGroup>
               <IconButton type="solid" onClick={createCoupon}>
                  <PlusIcon />
               </IconButton>
            </ButtonGroup>
         </StyledHeader>

         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={tableOptions}
         />
      </StyledWrapper>
   )
}

export default CustomerListing
