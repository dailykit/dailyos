import React from 'react'
import { rrulestr } from 'rrule'
import {
   Text,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
   Toggle,
} from '@dailykit/ui'
import { Container, Flex } from '../styled'
import { TableHeader, TableRecord } from './styled'

import { TimeSlots } from './components'
import {
   ReccurenceTunnel,
   TimeSlotTunnel,
   MileRangeTunnel,
   ChargesTunnel,
} from './tunnels'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   RECURRENCES,
   UPDATE_RECURRENCE,
   DELETE_RECURRENCE,
} from '../../../../graphql'
import {
   RecurrenceContext,
   reducers,
   state as initialState,
} from '../../../../context/recurrence'
import { DeleteIcon } from '../../../../assets/icons'
import { Context } from '../../../../context'
import { toast } from 'react-toastify'

const Main = () => {
   const [recurrences, setRecurrences] = React.useState(undefined)
   const {
      state: { current },
   } = React.useContext(Context)
   const [recurrenceState, recurrenceDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscription
   const { loading, error } = useSubscription(RECURRENCES, {
      variables: {
         type: current.fulfillment,
      },
      onSubscriptionData: data => {
         setRecurrences(data.subscriptionData.data.recurrences)
      },
   })

   // Mutations
   const [updateRecurrence] = useMutation(UPDATE_RECURRENCE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })
   const [deleteRecurrence] = useMutation(DELETE_RECURRENCE, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const deleteHandler = id => {
      if (window.confirm('Are you sure you want to delete?')) {
         deleteRecurrence({
            variables: {
               id,
            },
         })
      }
   }

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
            <Tunnel layer={4}>
               <ChargesTunnel closeTunnel={closeTunnel} />
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
                        <span>Availability</span>
                        <span>Time Slots</span>
                        <span>Availability</span>
                        <span>Delivery Range</span>
                        <span>Lead Time</span>
                        <span>Availability</span>
                        <span>Order Value</span>
                        <span>Charges</span>
                     </TableHeader>
                     {recurrences.map(recurrence => (
                        <TableRecord key={recurrence.id}>
                           <div style={{ padding: '16px' }}>
                              {rrulestr(recurrence.rrule).toText()}
                           </div>
                           <Flex direction="row" style={{ padding: '16px' }}>
                              <Toggle
                                 checked={recurrence.isActive}
                                 setChecked={val =>
                                    updateRecurrence({
                                       variables: {
                                          id: recurrence.id,
                                          set: {
                                             isActive: val,
                                          },
                                       },
                                    })
                                 }
                              />
                              <span
                                 className="action"
                                 onClick={() => deleteHandler(recurrence.id)}
                              >
                                 <DeleteIcon color=" #FF5A52" />
                              </span>
                           </Flex>
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
