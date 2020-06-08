import React from 'react'
import { rrulestr } from 'rrule'
import {
   Text,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui'
import { Container } from '../styled'
import { TableHeader, TableRecord } from './styled'

import { TimeSlots } from './components'
import { ReccurenceTunnel, TimeSlotTunnel, MileRangeTunnel } from './tunnels'
import { useSubscription } from '@apollo/react-hooks'
import { RECURRENCES } from '../../../../graphql'
import {
   RecurrenceContext,
   reducers,
   state as initialState,
} from '../../../../context/recurrence'

const Main = () => {
   const [recurrences, setRecurrences] = React.useState(undefined)
   const [recurrenceState, recurrenceDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const { loading, error } = useSubscription(RECURRENCES, {
      variables: {
         type: 'PREORDER_DELIVERY',
      },
      onSubscriptionData: data => {
         setRecurrences(data.subscriptionData.data.recurrences)
      },
   })

   if (loading) return <Loader />

   if (error) return <Text as="p">Some error occured!</Text>

   return (
      <RecurrenceContext.Provider
         value={{ recurrenceState, recurrenceDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ReccurenceTunnel closeTunnel={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <TimeSlotTunnel closeTunnel={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <MileRangeTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Container
            position="fixed"
            height="100vh"
            style={{ overflowY: 'scroll', width: '100%' }}
         >
            <Container
               paddingX="32"
               bg="#fff"
               position="fixed"
               width="100%"
               style={{ zIndex: '10' }}
            >
               <Text as="h1">Recurrences</Text>
            </Container>
            <Container top="80" paddingX="32" bottom="64">
               {Boolean(recurrences?.length) && (
                  <>
                     <TableHeader>
                        <span>Recurrences</span>
                        <span>Time Slots</span>
                        <span>Delivery Range</span>
                        <span>Lead Time</span>
                        <span>Order Value</span>
                        <span>Charges</span>
                     </TableHeader>
                     {recurrences.map(recurrence => (
                        <TableRecord key={recurrence.id}>
                           <div style={{ padding: '16px' }}>
                              {rrulestr(recurrence.rrule).toText()}
                           </div>
                           <div>
                              <TimeSlots
                                 recurrenceId={recurrence.id}
                                 timeSlots={recurrence.timeSlots}
                                 openTunnel={openTunnel}
                              />
                           </div>
                        </TableRecord>
                     ))}
                  </>
               )}
               <ButtonTile
                  noIcon
                  type="secondary"
                  text="Add Recurrence"
                  onClick={() => openTunnel(1)}
               />
            </Container>
         </Container>
      </RecurrenceContext.Provider>
   )
}

export default Main
