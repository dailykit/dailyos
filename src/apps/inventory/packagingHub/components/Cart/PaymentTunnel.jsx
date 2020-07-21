import React, { useState } from 'react'
import { TunnelHeader, Loader, Checkbox, TextButton } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled, { css } from 'styled-components'

import { ORGANIZATION_PAYMENT_INFO } from '../../graphql'
import { TunnelContainer } from '../../../components'
import { FlexContainer } from '../../../views/Forms/styled'
import useOrganizationBalanceInfo from '../../hooks/useOrganizationBalance'

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

function PaymentDetails({ chargeAmount, handlePayment }) {
   return (
      <div>
         <FlexContainer
            style={{
               padding: '20px 28px',
               backgroundColor: '#F3F3F3',
               justifyContent: 'space-between',
               marginTop: '20px',
            }}
         >
            <p>Total Payable:</p>
            <p>$ {chargeAmount}</p>
         </FlexContainer>
         <TextButton
            style={{ width: '100%' }}
            type="solid"
            onClick={handlePayment}
         >
            Confirm and Pay
         </TextButton>
      </div>
   )
}

function StripeBalance({ availableBalance, checked, setChecked }) {
   const totalBalance = availableBalance.reduce(
      (acc, curr) => acc + curr.amount,
      0
   )

   return (
      <BalanceCard selectable={totalBalance} onClick={setChecked}>
         <FlexContainer>
            {totalBalance && <Checkbox checked={checked} onChange={() => {}} />}
            <span style={{ width: '14px' }} />
            <h1>Payout Balance</h1>
         </FlexContainer>
         <div>
            <span style={{ fontSize: '14px', fontStyle: 'italic' }}>
               Available
            </span>
            <h1 style={{ color: '#53C22B' }}>$ {totalBalance / 100}</h1>
         </div>
      </BalanceCard>
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
const BalanceCard = styled.div`
   margin-top: 16px;
   border: 1px solid #cecece;
   padding: 16px 32px;

   display: flex;
   align-items: center;
   justify-content: space-between;

   ${({ selectable }) =>
      selectable &&
      css`
         cursor: pointer;

         &:hover {
            background-color: #f3f3f3;
         }
      `}

   h1 {
      font-size: 20px;
      color: #555b6e;
   }
`
