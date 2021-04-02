import React from 'react'
import { isEmpty } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Filler,
   Spacer,
   TextButton,
   TunnelHeader,
   HorizontalTabs as Tabs,
   HorizontalTabList as TabList,
   HorizontalTab as Tab,
   HorizontalTabPanels as TabPanels,
   HorizontalTabPanel as TabPanel,
} from '@dailykit/ui'

import { Wrapper } from './styled'
import { QUERIES } from '../../graphql'
import { useOrder } from '../../context'
import { InlineLoader } from '../../../../shared/components'

export const ManagePayment = ({ closeTunnel }) => {
   const { state, dispatch } = useOrder()
   const { loading, data: { cart = {} } = {} } = useSubscription(
      QUERIES.CART.ONE,
      {
         skip: !state.cart?.id,
         variables: { id: state.cart?.id },
      }
   )

   const close = () => {
      dispatch({ type: 'SET_CART_ID', payload: null })
      closeTunnel(1)
   }

   if (loading)
      return (
         <Wrapper>
            <TunnelHeader close={close} title="Manage Payment" />
            <InlineLoader />
         </Wrapper>
      )
   return (
      <Wrapper>
         <TunnelHeader close={close} title="Manage Payment" />
         <Flex padding="0 16px" overflowY="auto" maxHeight="calc(100% - 104px)">
            <Flex container alignItems="center">
               <TextButton
                  size="sm"
                  type="solid"
                  disabled={cart.paymentStatus === 'SUCCEEDED'}
               >
                  Send Invoice
               </TextButton>
               <Spacer size="16px" xAxis />
               <TextButton
                  size="sm"
                  type="ghost"
                  disabled={cart.paymentStatus === 'SUCCEEDED'}
               >
                  Retry Payment
               </TextButton>
            </Flex>
            <Spacer size="16px" />
            {cart?.stripeInvoiceDetails?.hosted_invoice_url && (
               <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={cart?.stripeInvoiceDetails?.hosted_invoice_url}
               >
                  View Invoice
               </a>
            )}
            <Spacer size="24px" />
            <Tabs>
               <TabList>
                  <Tab>Invoice History</Tab>
                  <Tab>Transaction History</Tab>
               </TabList>
               <TabPanels>
                  <TabPanel>
                     {isEmpty(cart.stripeInvoiceHistory) ? (
                        <Filler message="No invoices" />
                     ) : (
                        cart.stripeInvoiceHistory.map((node, index) => (
                           <pre key={index}>
                              <code>
                                 {JSON.stringify(node.details, null, 3)}
                              </code>
                           </pre>
                        ))
                     )}
                  </TabPanel>
                  <TabPanel>
                     {isEmpty(cart.transactionRemarkHistory) ? (
                        <Filler message="No transaction" />
                     ) : (
                        cart.transactionRemarkHistory.map((node, index) => (
                           <pre key={index}>
                              <code>
                                 {JSON.stringify(node.details, null, 3)}
                              </code>
                           </pre>
                        ))
                     )}
                  </TabPanel>
               </TabPanels>
            </Tabs>
         </Flex>
      </Wrapper>
   )
}
