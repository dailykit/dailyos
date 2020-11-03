import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Form,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   IconButton,
   TunnelHeader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { usePlan } from '../state'
import Customers from './Customers'
import Occurences from './Occurences'
import DeliveryAreas from './DeliveryAreas'
import { DeliveryDaySection } from '../styled'
import { logger } from '../../../../../../shared/utils'
import { EditIcon } from '../../../../../../shared/assets/icons'
import { UPDATE_SUBSCRIPTION, SUBSCRIPTION } from '../../../../graphql'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
   ErrorBoundary,
} from '../../../../../../shared/components'

const DeliveryDay = ({ id }) => {
   const { state, dispatch } = usePlan()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [areasTotal, setAreasTotal] = React.useState(0)
   const [customersTotal, setCustomersTotal] = React.useState(0)
   const [occurencesTotal, setOccurencesTotal] = React.useState(0)
   const { error, loading } = useSubscription(SUBSCRIPTION, {
      variables: {
         id,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { subscription = {} } = {} } = {},
      }) => {
         dispatch({ type: 'SET_SUBSCRIPTION', payload: { ...subscription } })
      },
   })

   React.useState(() => {
      return () => {
         dispatch({ type: 'SET_SUBSCRIPTION', payload: { id: null } })
      }
   }, [])

   if (loading) return <InlineLoader />
   if (error) {
      toast.error('Failed to fetch the list of delivery days!')
      logger(error)
      return <ErrorState message="Failed to fetch the list of delivery days!" />
   }
   return (
      <DeliveryDaySection>
         <Flex
            container
            as="header"
            height="56px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex as="section" container alignItems="center">
               <Text as="title">Subscription</Text>
               <Tooltip identifier="form_subscription_section_delivery_day_heading" />
            </Flex>
            <IconButton type="outline" onClick={() => openTunnel(1)}>
               <EditIcon />
            </IconButton>
         </Flex>
         <Text as="subtitle">
            Ends on - {moment(state.subscription.endDate).format('MMM DD')}
         </Text>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>Occurences ({occurencesTotal})</HorizontalTab>
               <HorizontalTab>Delivery Areas ({areasTotal})</HorizontalTab>
               <HorizontalTab>Customers ({customersTotal})</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <Occurences id={id} setOccurencesTotal={setOccurencesTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <DeliveryAreas id={id} setAreasTotal={setAreasTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <Customers id={id} setCustomersTotal={setCustomersTotal} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
         <ErrorBoundary rootRoute="/subscription/subscriptions">
            <EditSubscriptionTunnel
               tunnels={tunnels}
               closeTunnel={closeTunnel}
            />
         </ErrorBoundary>
      </DeliveryDaySection>
   )
}

export default DeliveryDay

const EditSubscriptionTunnel = ({ tunnels, closeTunnel }) => {
   const { state } = usePlan()
   const [endDate, setEndDate] = React.useState(null)
   const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION, {
      onCompleted: () => {
         closeTunnel(1)
      },
   })

   const close = () => {
      closeTunnel(1)
      setEndDate(null)
   }
   const save = () => {
      updateSubscription({
         variables: {
            id: state.subscription.id,
            _set: {
               endDate,
            },
         },
      })
   }
   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer="1">
            <TunnelHeader
               title="Edit Subscription"
               close={() => close()}
               right={{ action: () => save(), title: 'Save' }}
               tooltip={
                  <Tooltip identifier="form_subscription_tunnel_subscription_field_date" />
               }
            />
            <Flex padding="16px">
               <Form.Group>
                  <Form.Label htmlFor="endDate" title="endDate">
                     <Flex container alignItems="center">
                        End Date*
                        <Tooltip identifier="form_subscription_tunnel_edit_subscription_field_end_date" />
                     </Flex>
                  </Form.Label>
                  <Form.Date
                     id="endDate"
                     name="endDate"
                     value={endDate}
                     defaultValue={state.subscription.endDate}
                     onChange={e => setEndDate(e.target.value)}
                  />
               </Form.Group>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}
