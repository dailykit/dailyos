import React, { useState, useEffect, useRef } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import {
   Text,
   ButtonGroup,
   IconButton,
   ComboButton,
   PlusIcon,
   Loader,
   Flex,
   Form,
} from '@dailykit/ui'
import {
   COUPON_LISTING,
   COUPON_TOTAL,
   COUPON_ACTIVE,
   CREATE_COUPON,
   DELETE_COUPON,
} from '../../../graphql'
import { useTabs } from '../../../context'
import { StyledWrapper } from './styled'
import { randomSuffix } from '../../../../../shared/utils'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import options from '../../tableOptions'

const CouponListing = () => {
   const { addTab, tab } = useTabs()
   const [coupons, setCoupons] = useState(undefined)
   const tableRef = useRef()
   // Subscription
   const { loading: listLoading, error } = useSubscription(COUPON_LISTING, {
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
         toast.error('Something went wrong !')
         logger(error)
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
         toast.error('Something went wrong !')
         logger(error)
      },
   })

   if (error) {
      toast.error('Something went wrong !')
      logger(error)
   }

   useEffect(() => {
      if (!tab) {
         addTab('Coupons', '/crm/coupons')
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
         <Form.Group>
            <Form.Toggle
               name="coupon_active"
               onChange={() => toggleHandler(!rowData.active, rowData.id)}
               value={rowData.active}
            />
         </Form.Group>
      )
   }

   const DeleteButton = () => {
      return (
         <IconButton type="ghost">
            <DeleteIcon color="#FF5A52" />
         </IconButton>
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

   const rowClick = (e, cell) => {
      const { id, code } = cell._cell.row.data
      const param = `/crm/coupons/${id}`
      const tabTitle = code
      addTab(tabTitle, param)
   }

   const columns = [
      {
         title: 'Coupon Code',
         field: 'code',
         headerFilter: true,
         hozAlign: 'left',
         cssClass: 'rowClick',
         cellClick: (e, cell) => {
            rowClick(e, cell)
         },
      },
      {
         title: 'Used',
         field: 'used',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 100,
      },
      {
         title: 'Conversion Rate',
         field: 'rate',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Amount Spent',
         field: 'amount',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
      {
         title: 'Active',
         field: 'active',
         formatter: reactFormatter(<ToggleButton />),
         hozAlign: 'center',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 100,
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
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 100,
      },
   ]
   if (loading || listLoading) return <Loader />
   return (
      <StyledWrapper>
         <Flex container alignItems="center" justifyContent="space-between">
            <Flex container height="80px" alignItems="center">
               <Text as="h2">
                  Coupons(
                  {couponTotal?.couponsAggregate?.aggregate?.count || '...'})
               </Text>
               <Tooltip identifier="coupon_list_heading" />
            </Flex>
            <ButtonGroup>
               <ComboButton type="solid" onClick={createCoupon}>
                  <PlusIcon />
                  Create Coupon
               </ComboButton>
            </ButtonGroup>
         </Flex>
         {Boolean(coupons) && (
            <ReactTabulator
               columns={columns}
               data={coupons}
               options={{
                  ...options,
                  placeholder: 'No Coupons Available Yet !',
               }}
               ref={tableRef}
            />
         )}
      </StyledWrapper>
   )
}

export default CouponListing
