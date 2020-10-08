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
import { BRAND_COUPONS, UPSERT_BRAND_COUPON } from '../../../../../graphql'
import { StyledHeader, StyledWrapper } from './styled'

const BrandCoupon = ({ state }) => {
   const tableRef = useRef()

   // Subscription
   const {
      loading: listloading,
      error,
      data: { brands = [] } = {},
   } = useSubscription(BRAND_COUPONS)

   const [upsertBrandCoupon] = useMutation(UPSERT_BRAND_COUPON, {
      onCompleted: data => {
         console.log(data)
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const columns = [
      {
         title: 'Title',
         field: 'title',
         headerFilter: true,
         headerSort: false,
         hozAlign: 'left',
         width: 200,
      },
      {
         title: 'Domain',
         field: 'domain',
         headerFilter: true,
         hozAlign: 'left',
         width: 350,
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

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitData',
      autoResize: true,
      maxHeight: '420px',
      resizableColumns: false,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
      pagination: 'local',
      paginationSize: 10,
   }

   if (listloading) return <Loader />

   return (
      <StyledWrapper>
         <Text as="h2">Brands</Text>

         {error ? (
            <Text as="p">Could not load brands</Text>
         ) : (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={brands}
               options={options}
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
