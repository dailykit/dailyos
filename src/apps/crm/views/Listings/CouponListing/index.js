import React, { useState, useEffect, useRef } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import {
   Text,
   ButtonGroup,
   IconButton,
   PlusIcon,
   Toggle,
   Loader,
} from '@dailykit/ui'
import {
   COUPON_LISTING,
   COUPON_TOTAL,
   COUPON_ACTIVE,
   CREATE_COUPON,
   DELETE_COUPON,
} from '../../../graphql'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import tableOptions from '../tableOptions'
import { randomSuffix } from '../../../../../shared/utils'
import { DeleteIcon } from '../../../../../shared/assets/icons'

const CouponListing = () => {
   const { addTab, tab } = useTabs()
   const [coupons, setCoupons] = useState([])
   const tableRef = useRef(null)
   // Subscription
   const { loading: listLoading } = useSubscription(COUPON_LISTING, {
      onSubscriptionData: data => {
         const result = data.subscriptionData.data.coupons.map(coupon => {
            return {
               id: coupon.id,
               code: coupon.code,
               used: 'N/A',
               rate: 'N/A',
               amount: 'N/A',
               active: coupon.isActive,
               duration: 'N/A',
            }
         })
         setCoupons(result)
      },
   })
   const { data: couponTotal, loading } = useSubscription(COUPON_TOTAL)

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

   useEffect(() => {
      if (tableRef.current) {
         tableRef.current.table.setData(coupons)
      }
   })

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

   const [deleteCoupon] = useMutation(DELETE_COUPON, {
      onCompleted: () => {
         toast.success('Coupon deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, coupon) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete Coupon - ${coupon.code}?`
         )
      ) {
         deleteCoupon({
            variables: {
               id: coupon.id,
            },
         })
      }
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
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIcon color="#555B6E" />),
      },
   ]
   if (loading) return <Loader />
   if (listLoading) return <Loader />
   return (
      <StyledWrapper>
         <StyledHeader gridCol="10fr  1fr">
            <Text as="title">
               Coupons(
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
            data={coupons}
            rowClick={rowClick}
            options={tableOptions}
            ref={tableRef}
         />
      </StyledWrapper>
   )
}

export default CouponListing
