import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
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
import { Flex } from '../../../../components'
import { DeliveryDaySection } from '../styled'
import { EditIcon } from '../../../../../../shared/assets/icons'
import { InlineLoader } from '../../../../../../shared/components'
import { UPDATE_SUBSCRIPTION, SUBSCRIPTION } from '../../../../graphql'

const DeliveryDay = ({ id }) => {
   const { state, dispatch } = usePlan()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [areasTotal, setAreasTotal] = React.useState(0)
   const [customersTotal, setCustomersTotal] = React.useState(0)
   const [occurencesTotal, setOccurencesTotal] = React.useState(0)
   const { loading } = useSubscription(SUBSCRIPTION, {
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
   return (
      <DeliveryDaySection>
         <Flex
            container
            height="56px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Text as="title">Subscription</Text>
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
         <EditSubscriptionTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
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
            />
            <Flex padding="16px">
               <DateInput>
                  <label htmlFor="endDate">End Date</label>
                  <input
                     type="date"
                     id="endDate"
                     name="endDate"
                     value={endDate}
                     defaultValue={state.subscription.endDate}
                     onChange={e => setEndDate(e.target.value)}
                  />
               </DateInput>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}

const DateInput = styled.div`
   width: 180px;
   position: relative;
   label {
      top: -8px;
      color: #888d9d;
      font-size: 14px;
      position: absolute;
   }
   input {
      border: none;
      height: 40px;
      width: inherit;
      font-size: 16px;
      font-weight: 400;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      :focus {
         outline: none;
         border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      }
   }
`
