import React, { useState } from 'react'
import { TunnelHeader, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { ORGANIZATION_PAYMENT_INFO } from '../../graphql'
import { TunnelContainer } from '../../../components'
import useOrganizationBalanceInfo from '../../hooks/useOrganizationBalance'

import StripeBalance from './StripeBalance'
import PaymentDetails from './PaymentDetails'

export default function CartTunnel({ close }) {
   const [balanceChecked, setBalanceChecked] = useState(false)

   const handleBalanceCheck = () => {
      setBalanceChecked(checked => !checked)
   }

   const handlePayment = () => {
      // add other payment checked here.
      if (!balanceChecked) return toast.error('Please select a payment method.')

      console.log('transacting...')
   }

   const {
      data: { organizationPurchaseOrders_purchaseOrder: org = [] } = {},
      loading,
   } = useQuery(ORGANIZATION_PAYMENT_INFO, {
      fetchPolicy: 'network-only',
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const {
      loading: balanceLoading,
      error,
      data: { available: availableBalance = [] } = {},
   } = useOrganizationBalanceInfo(org[0]?.organization?.stripeAccountId)

   if (error) {
      console.log(error)
      return toast.error(error.message)
   }

   if (loading || balanceLoading) return <Loader />

   return (
      <>
         <TunnelHeader title="Purchase Orders" close={() => close(2)} />

         <Wrapper>
            <h2>Pay via:</h2>

            <StripeBalance
               availableBalance={availableBalance.filter(
                  x => x.currency === 'usd'
               )}
               checked={balanceChecked}
               setChecked={handleBalanceCheck}
            />

            <PaymentDetails
               chargeAmount={org[0]?.netChargeAmount}
               handlePayment={handlePayment}
            />
         </Wrapper>
      </>
   )
}

const Wrapper = styled(TunnelContainer)`
   width: 50%;
   color: #555b6e;

   padding: 16px 4rem;

   h2 {
      font-size: 16px;
   }

   p {
      font-size: 14px;
      font-weight: 500;
   }
`
