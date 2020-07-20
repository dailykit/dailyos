import React from 'react'
import { TunnelHeader, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { ORGANIZATION_PAYMENT_INFO } from '../../graphql'
import { TunnelContainer } from '../../../components'
import useOrganizationBalanceInfo from '../../hooks/useOrganizationBalance'

export default function CartTunnel({ close }) {
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

   const { loading: balanceLoading, error, data } = useOrganizationBalanceInfo(
      org[0]?.organization?.stripeAccountId
   )

   console.log(data)

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
         </Wrapper>
      </>
   )
}

const Wrapper = styled(TunnelContainer)`
   width: 100%;
   color: #555b6e;

   padding: 16px 4rem;

   h2 {
      font-size: 16px;
   }

   p {
      font-size: 12px;
      margin-top: 4px;
   }
`
