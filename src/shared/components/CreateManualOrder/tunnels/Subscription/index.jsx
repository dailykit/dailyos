import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { Flex, Text, Filler, TunnelHeader, Spacer } from '@dailykit/ui'

import { QUERIES } from '../../graphql'
import { InlineLoader } from '../../..'
import { useManual } from '../../state'
import { logger } from '../../../../utils'
import EmptyIllo from '../../../../../apps/carts/assets/svgs/EmptyIllo'

export const SubscriptionTunnel = () => {
   const { customer, methods, tunnels } = useManual()
   const [occurence, setOccurence] = React.useState(null)
   return (
      <>
         <TunnelHeader
            title="Select Subscription"
            close={() => tunnels.close(4)}
            right={{
               title: 'Save',
               disabled: !occurence,
               isLoading: methods.cart.create.loading,
               action: () => {
                  methods.cart.create.mutate(null, occurence)
               },
            }}
         />
         <Flex padding="16px" overflowY="auto" height="calc(100vh - 196px)">
            {customer?.isSubscriber && customer?.subscriptionId ? (
               <SelectOccurence
                  occurence={occurence}
                  setOccurence={setOccurence}
               />
            ) : (
               <Filler
                  illustration={<EmptyIllo />}
                  message="Customer has not subscribed yet!"
               />
            )}
         </Flex>
      </>
   )
}

const SelectOccurence = ({ occurence, setOccurence }) => {
   const { customer } = useManual()
   const [occurences, setOccurences] = React.useState([])
   const [isOccurencesEmpty, setIsOccurencesEmpty] = React.useState(false)
   const [hasOccurencesError, setHasOccurencesError] = React.useState(false)
   const [isOccurencesLoading, setIsOccurencesLoading] = React.useState(true)
   useQuery(QUERIES.SUBSCRIPTION.OCCURENCE.LIST, {
      variables: {
         where: {
            subscriptionId: { _eq: customer?.subscriptionId },
            subscriptionOccurenceView: {
               isValid: { _eq: true },
               isVisible: { _eq: true },
            },
         },
         whereCustomer: { keycloakId: { _eq: customer?.keycloakId } },
      },
      onCompleted: ({ occurences = [] } = {}) => {
         if (occurences.length === 0) {
            setIsOccurencesEmpty(true)
            setIsOccurencesLoading(false)
            return
         }

         const list = []

         occurences.forEach(({ customers, ...rest }) => {
            if (customers.length === 0) {
               list.push({
                  ...rest,
                  hasOccurenceCustomer: false,
               })
               return
            }
            const [customer] = customers
            if (!customer.hasCart) {
               list.push({
                  ...rest,
                  hasOccurenceCustomer: true,
               })
            }
         })

         if (list.length === 0) {
            setIsOccurencesEmpty(true)
            setIsOccurencesLoading(false)
            return
         }
         setOccurences(list)
         setIsOccurencesLoading(false)
      },
      onError: error => {
         logger(error)
         setHasOccurencesError(true)
         setIsOccurencesLoading(false)
         toast.error('Failed to fetch occurences, please try again!')
      },
   })
   if (isOccurencesLoading) return <InlineLoader />
   if (hasOccurencesError)
      return (
         <Filler
            message="Failed to fetch occurences, please try again!"
            illustration={<EmptyIllo />}
         />
      )
   if (isOccurencesEmpty)
      return (
         <Filler
            message="No occurences available!"
            illustration={<EmptyIllo />}
         />
      )
   return (
      <>
         <Text as="h3">Select Occurence</Text>
         <Spacer size="16px" />
         <Styles.Occurences>
            {occurences.map(node => (
               <Styles.Occurence
                  key={node.id}
                  className={`${node.id === occurence ? 'active' : ''}`}
                  onClick={() => setOccurence(node.id)}
               >
                  {moment(node.fulfillmentDate).format('MMM DD, YYYY')}
               </Styles.Occurence>
            ))}
         </Styles.Occurences>
      </>
   )
}

const Styles = {
   Occurences: styled.ul`
      display: grid;
      grid-gap: 14px;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
   `,
   Occurence: styled.li`
      height: 40px;
      cursor: pointer;
      padding: 0 14px;
      list-style: none;
      border-radius: 2px;
      border: 1px solid #e3e3e3;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
         border-color: #367bf5;
      }
   `,
}
