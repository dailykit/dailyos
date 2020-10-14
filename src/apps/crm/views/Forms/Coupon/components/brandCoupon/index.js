import React, { useState, useEffect, useRef } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import { Text, Flex, Toggle, Loader } from '@dailykit/ui'
import { BRAND_COUPONS, UPSERT_BRAND_COUPON } from '../../../../../graphql'
import { StyledHeader, StyledWrapper } from './styled'
import options from '../../../../tableOptions'
import { Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'

const BrandCoupon = ({ state }) => {
   const tableRef = useRef()

   // Subscription
   const {
      loading: listloading,
      error,
      data: { brands = [] } = {},
   } = useSubscription(BRAND_COUPONS)

   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }

   const [upsertBrandCoupon] = useMutation(UPSERT_BRAND_COUPON, {
      onCompleted: data => {
         console.log(data)
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   const columns = [
      {
         title: 'Title',
         field: 'title',
         headerFilter: true,
         headerSort: false,
         hozAlign: 'left',
      },
      {
         title: 'Domain',
         field: 'domain',
         headerFilter: true,
         hozAlign: 'left',
      },
      {
         title: 'Coupon Available',
         formatter: reactFormatter(
            <ToggleCoupon
               couponId={state.id}
               onChange={object => upsertBrandCoupon({ variables: { object } })}
            />
         ),
         hozAlign: 'center',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 200,
      },
   ]

   if (listloading) return <Loader />

   return (
      <StyledWrapper>
         <Flex container height="80px" alignItems="center" padding="6px">
            <Text as="h2">Brands</Text>
            <Tooltip identifier="brand_coupon_list_heading" />
         </Flex>
         {error ? (
            <Text as="p">Could not load brands</Text>
         ) : (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={brands}
               options={{
                  ...options,
                  placeholder: 'No Brand Coupons Data Available Yet !',
               }}
            />
         )}
      </StyledWrapper>
   )
}

export default BrandCoupon

const ToggleCoupon = ({ cell, couponId, onChange }) => {
   const brand = useRef(cell.getData())
   const [active, setActive] = useState(false)

   const toggleHandler = value => {
      console.log(value)
      onChange({
         couponId,
         brandId: brand.current.id,
         isActive: value,
      })
   }

   React.useEffect(() => {
      console.log(brand)
      const isActive = brand.current.brand_coupons.some(
         coupon => coupon.couponId === couponId && coupon.isActive
      )
      console.log(isActive)
      setActive(isActive)
   }, [brand.current])

   return <Toggle checked={active} setChecked={val => toggleHandler(val)} />
}
