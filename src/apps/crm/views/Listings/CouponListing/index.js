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
import { randomSuffix } from '../../../../../shared/utils'
import { DeleteIcon } from '../../../../../shared/assets/icons'

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
   if (error) {
      console.log(error)
   }
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
      {
         title: 'Coupon Code',
         field: 'code',
         headerFilter: true,
         hozAlign: 'left',
      },
      {
         title: 'Used',
         field: 'used',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Conversion Rate',
         field: 'rate',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Amount Spent',
         field: 'amount',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
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
      },
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIcon color="#555B6E" />),
         hozAlign: 'center',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
      },
   ]
   if (loading || listLoading) return <Loader />
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
         {Boolean(coupons) && (
            <ReactTabulator
               columns={columns}
               data={coupons}
               rowClick={rowClick}
               options={options}
               ref={tableRef}
            />
         )}
      </StyledWrapper>
   )
}

export default CouponListing

const options = {
   cellVertAlign: 'middle',
   layout: 'fitColumns',
   autoResize: true,
   maxHeight: '420px',
   resizableColumns: true,
   virtualDomBuffer: 80,
   placeholder: 'No Data Available',
   persistence: true,
   persistenceMode: 'cookie',
   pagination: 'local',
   paginationSize: 10,
}
