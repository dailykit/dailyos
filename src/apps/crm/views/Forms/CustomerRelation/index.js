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
} from '../../../graphql'
import {
   OrdersTable,
   ReferralTable,
   WalletTable,
   SubscriptionTable,
} from '../../Tables'
import {
   StyledWrapper,
   StyledContainer,
   StyledSideBar,
   StyledMainBar,
   StyledTable,
} from './styled'
import {
   CustomerCard,
   ContactInfoCard,
   PaymentCard,
   OrderCard,
   ReferralCard,
   SubscriptionCard,
   WalletCard,
   SubscriptionInfoCard,
} from '../../../components'
import { PaymentTunnel, AddressTunnel } from './Tunnel'
import { logger } from '../../../../../shared/utils'
import { InlineLoader } from '../../../../../shared/components'

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
   } else if (tab?.data?.activeCard === 'Subscriber') {
      table = (
         <SubscriptionTable
            id={match.params.id}
            sid={subscriptionData?.customer?.subscriptionId || ''}
         />
      )
   }
   if (listLoading || list_Loading || list__Loading || customerloading) {
      return <InlineLoader />
   }
   return (
      <StyledWrapper>
         <Flex container>
            <StyledSideBar>
               <CustomerCard
                  customer={customerData?.customer}
                  walletAmount="N/A"
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
               />
            </StyledSideBar>
            <Flex container width="80%" flexDirection="column">
               <Flex
                  container
                  justifyContent="space-between"
                  margin="0 16px 16px 0"
               >
                  <OrderCard
                     data={customerData?.customer?.orders_aggregate?.aggregate}
                     click={() => setActiveCard('Orders')}
                     active={tab.data.activeCard}
                     heading="Orders"
                  />
                  <ReferralCard
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
                     click={() => setActiveCard('Wallet')}
                     active={tab.data.activeCard}
                     heading="Wallet"
                  />
               </Flex>
               <StyledTable>{table}</StyledTable>
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
