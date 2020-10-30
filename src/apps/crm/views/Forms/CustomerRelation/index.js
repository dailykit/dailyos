import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useTunnel, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useTabs } from '../../../context'
import {
   CUSTOMER_DATA,
   SUBSCRIPTION,
   SUBSCRIPTION_PLAN,
   ISTEST,
   CUSTOMER_ISTEST,
   WALLET_N_REFERRAL,
   SIGNUP_COUNT,
   LOYALTYPOINT_COUNT,
} from '../../../graphql'
import {
   OrdersTable,
   ReferralTable,
   WalletTable,
   LoyaltyPointsTable,
   SubscriptionTable,
} from '../../Tables'
import {
   StyledWrapper,
   StyledSideBar,
   StyledTable,
   FlexContainer,
} from './styled'
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   OrderCard,
   ReferralCard,
   SubscriptionCard,
   WalletCard,
   LoyaltyCard,
   SubscriptionInfoCard,
} from '../../../components'
import { PaymentTunnel, AddressTunnel } from './Tunnel'
import { logger } from '../../../../../shared/utils'
import {
   InlineLoader,
   InsightDashboard,
} from '../../../../../shared/components'

const CustomerRelation = ({ match }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [tunnels1, openTunnel1, closeTunnel1] = useTunnel(1)
   const { dispatch, tab } = useTabs()
   const history = useHistory()
   const { data: customerIsTest, loading: customerloading } = useSubscription(
      CUSTOMER_ISTEST,
      {
         variables: { keycloakId: match.params.id },
      }
   )
   const {
      data: walletNreferral,
      loading: walletNreferralLoading,
   } = useSubscription(WALLET_N_REFERRAL, {
      variables: { keycloakId: match.params.id },
   })
   const { data: loyaltyPoint, loading: loyaltyPointLoading } = useSubscription(
      LOYALTYPOINT_COUNT,
      {
         variables: { keycloakId: match.params.id },
      }
   )
   const { data: signUpCount, loading: signUpLoading } = useSubscription(
      SIGNUP_COUNT,
      {
         variables: { keycloakId: match.params.id },
      }
   )
   const { loading: listLoading, data: customerData } = useQuery(
      CUSTOMER_DATA,
      {
         variables: {
            keycloakId: match.params.id,
         },
         onError: error => {
            toast.error('Something went wrong')
            logger(error)
         },
      }
   )
   const { loading: list_Loading, data: subscriptionData } = useQuery(
      SUBSCRIPTION,
      {
         variables: {
            keycloakId: match.params.id,
         },
         onError: error => {
            toast.error('Something went wrong')
            logger(error)
         },
      }
   )
   const { loading: list__Loading, data: subscriptionPlan } = useQuery(
      SUBSCRIPTION_PLAN,
      {
         variables: {
            keycloakId: match.params.id,
         },
         onError: error => {
            toast.error('Something went wrong')
            logger(error)
         },
      }
   )
   const [updateIsTest] = useMutation(ISTEST, {
      onCompleted: () => {
         toast.info('Information updated!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   const toggleHandler = toggle => {
      updateIsTest({
         variables: {
            keycloakId: match.params.id,
            isTest: toggle,
         },
      })
   }

   useEffect(() => {
      if (!tab) {
         history.push('/crm/customers')
      }
   }, [history, tab])

   const setActiveCard = card => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab?.path,
            data: { activeCard: card },
         },
      })
   }

   useEffect(() => {
      setActiveCard('Orders')
   }, [])

   let table = null
   if (tab?.data?.activeCard === 'Orders') {
      table = <OrdersTable id={match.params.id} />
   } else if (tab?.data?.activeCard === 'Referrals') {
      table = <ReferralTable />
   } else if (tab?.data?.activeCard === 'Wallet') {
      table = <WalletTable />
   } else if (tab?.data?.activeCard === 'LoyaltyPoints') {
      table = <LoyaltyPointsTable />
   } else if (tab?.data?.activeCard === 'Subscriber') {
      table = (
         <SubscriptionTable
            id={match.params.id}
            sid={subscriptionData?.customer?.subscriptionId || ''}
         />
      )
   }
   if (
      listLoading ||
      list_Loading ||
      list__Loading ||
      customerloading ||
      walletNreferralLoading ||
      signUpLoading ||
      loyaltyPointLoading
   ) {
      return <InlineLoader />
   }
   return (
      <StyledWrapper>
         <Flex container>
            <StyledSideBar>
               <CustomerCard
                  customer={customerData?.customer}
                  walletAmount={walletNreferral?.customer?.wallet?.amount || 0}
                  toggle={customerIsTest?.customer?.isTest}
                  toggleHandler={() =>
                     toggleHandler(!customerIsTest?.customer?.isTest)
                  }
               />
               <SubscriptionInfoCard planData={subscriptionPlan?.customer} />
               <ContactInfoCard
                  defaultTag2="(Default)"
                  customerData={customerData?.customer?.platform_customer}
                  onClick={() => openTunnel1(1)}
               />
               <PaymentCard
                  defaultTag="(Default)"
                  linkedTo="view all cards"
                  onClick={() => openTunnel(1)}
                  cardData={
                     customerData?.customer?.platform_customer
                        ?.defaultStripePaymentMethod || 'N/A'
                  }
                  billingAddDisplay="none"
                  identifier="default_payment_card_info"
               />
            </StyledSideBar>
            <Flex container width="80%" flexDirection="column">
               <FlexContainer>
                  <OrderCard
                     data={customerData?.customer?.orders_aggregate?.aggregate}
                     click={() => setActiveCard('Orders')}
                     active={tab.data.activeCard}
                     heading="Orders"
                  />
                  <ReferralCard
                     referralCount={
                        walletNreferral?.customer?.customerReferralDetails
                           ?.customerReferrals_aggregate?.aggregate?.count || 0
                     }
                     signUpCount={
                        signUpCount?.customer?.customerReferralDetails
                           ?.customerReferrals_aggregate?.aggregate?.count || 0
                     }
                     click={() => setActiveCard('Referrals')}
                     active={tab.data.activeCard}
                     heading="Referrals"
                  />
                  <SubscriptionCard
                     data={subscriptionData?.customer}
                     click={() => setActiveCard('Subscriber')}
                     active={tab.data.activeCard}
                     heading="Subscriber"
                  />
                  <WalletCard
                     data={walletNreferral?.customer?.wallet}
                     click={() => setActiveCard('Wallet')}
                     active={tab.data.activeCard}
                     heading="Wallet"
                  />
                  <LoyaltyCard
                     data={loyaltyPoint?.customer?.loyaltyPoint}
                     click={() => setActiveCard('LoyaltyPoints')}
                     active={tab.data.activeCard}
                     heading="LoyaltyPoints"
                  />
               </FlexContainer>
               <StyledTable>
                  {table}
                  <InsightDashboard
                     appTitle="CRM App"
                     moduleTitle="Customer Page"
                     variables={{ keycloakId: match.params.id }}
                  />
               </StyledTable>
            </Flex>
         </Flex>

         <PaymentTunnel
            tunnels={tunnels}
            openTunnel={openTunnel}
            closeTunnel={closeTunnel}
            id={match.params.id}
         />
         <AddressTunnel
            tunnels={tunnels1}
            openTunnel={openTunnel1}
            closeTunnel={closeTunnel1}
            id={match.params.id}
         />
      </StyledWrapper>
   )
}

export default CustomerRelation
