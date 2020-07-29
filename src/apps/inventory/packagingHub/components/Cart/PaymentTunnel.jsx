import React, { useState } from 'react'
import { TunnelHeader, Loader } from '@dailykit/ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import {
   ORGANIZATION_PAYMENT_INFO,
   CREATE_ORDER_TRANSACTION,
   REGISTER_PACKAGING,
   CART_ITEMS_FOR_REGISTERING,
} from '../../graphql'
import { TunnelContainer } from '../../../components'
import useOrganizationBalanceInfo from '../../hooks/useOrganizationBalance'

import StripeBalance from './StripeBalance'
import PaymentDetails from './PaymentDetails'

export default function CartTunnel({ close }) {
   const [balanceChecked, setBalanceChecked] = useState(false)

   const [createTransaction, { loading: transactionLoading }] = useMutation(
      CREATE_ORDER_TRANSACTION,
      {
         onError: error => {
            toast.error(error.message)
            console.log(error)
         },
         onCompleted: () => {
            toast.success('Order received!')
            close(2)
            close(1)
         },
      }
   )

   const [registerPackaging] = useMutation(REGISTER_PACKAGING, {
      onError: error => {
         toast.error(error.message)
         console.log(error)
      },
      onCompleted: () => {
         toast.success('Packaging registered in inventory!')
      },
   })

   const handleBalanceCheck = () => {
      setBalanceChecked(checked => !checked)
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
      data: {
         organizationPurchaseOrders_purchaseOrderItem: cartItems = [],
      } = {},
   } = useQuery(CART_ITEMS_FOR_REGISTERING, {
      fetchPolicy: 'network-only',
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const handlePayment = () => {
      // add other payment checked here.
      if (!balanceChecked) return toast.error('Please select a payment method.')

      // later object will be Array of multiple payment methods selected by the user.

      createTransaction({
         variables: {
            objects: {
               chargeAmount: org[0]?.netChargeAmount,
               connectedAccountId: org[0]?.organization?.stripeAccountId,
               purchaseOrderId: org[0]?.id,
               // if the selceted method is balance then 'BALANCE', default is 'CARD'
               type: 'BALANCE',
            },
         },
      })

      // also create a local copy with supplier info, packaging info and a purchaseOrdetItem entry for local management in dailyos.

      const objects = cartItems.map(item => ({
         name:
            item.packaging.packagingCompanyBrand.packagingCompany.supplierName,
         mandiSupplierId:
            item.packaging.packagingCompanyBrand.packagingCompany.id,
         packagings: {
            data: {
               name: item.packaging.packagingName,
               mandiPackagingId: item.packaging.id,
               unitQuantity:
                  item.packaging.packagingPurchaseOptions[0]?.quantity,
               minOrderValue:
                  item.packaging.packagingPurchaseOptions[0]?.quantity,
               innWaterRes:
                  item.packaging.packagingSpecification.innerWaterResistant,
               outWaterRes:
                  item.packaging.packagingSpecification.outerWaterResistant,
               recyclable: item.packaging.packagingSpecification.recyclable,
               compostable: item.packaging.packagingSpecification.compostable,
               fdaComp: item.packaging.packagingSpecification.fdaCompliant,
               innGreaseRes:
                  item.packaging.packagingSpecification.innerGreaseResistant,
               outGreaseRes:
                  item.packaging.packagingSpecification.outerGreaseResistant,
               image:
                  item.packaging.assets && item.packaging.assets?.length
                     ? item.packaging.assets[0]?.url
                     : null,
            },
            on_conflict: {
               constraint: 'packaging_mandiPackagingId_key',
               update_columns: [
                  'name',
                  'unitQuantity',
                  'minOrderValue',
                  'innWaterRes',
                  'outWaterRes',
                  'recyclable',
                  'compostable',
                  'fdaComp',
                  'innGreaseRes',
                  'outGreaseRes',
                  'image',
               ],
            },
         },

         purchaseOrderItems: {
            data: {
               orderQuantity: (item.quantity * item.multiplier).toFixed(3),
            },
            on_conflict: {
               constraint: 'purchaseOrderItem_mandiPurchaseOrderItemId_key',
               update_columns: ['orderQuantity'],
            },
         },
      }))

      registerPackaging({
         variables: {
            objects,
         },
      })
   }

   const {
      loading: balanceLoading,
      error,
      data: { available: availableBalance = [] } = {},
   } = useOrganizationBalanceInfo(org[0]?.organization?.stripeAccountId)

   if (error) {
      console.log(error)
      return toast.error(error.message)
   }

   if (loading || balanceLoading || transactionLoading) return <Loader />

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
