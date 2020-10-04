import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { rrulestr } from 'rrule'
import {
   Text,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
   Toggle,
   PlusIcon,
   IconButton,
   Tag,
   TextButton,
} from '@dailykit/ui'
import { Container, Flex, Grid } from '../styled'
import { TableHeader, TableRecord } from './styled'

import { TimeSlots } from './components'
import {
   ReccurenceTunnel,
   TimeSlotTunnel,
   MileRangeTunnel,
   ChargesTunnel,
   BrandsTunnel,
} from './tunnels'
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

const Main = () => {
   const [recurrences, setRecurrences] = React.useState(undefined)
   const { type } = useParams()
   const [recurrenceState, recurrenceDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Subscription
   const { loading, error } = useSubscription(RECURRENCES, {
      variables: {
         type,
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

   const linkWithBrands = recurrenceId => {
      recurrenceDispatch({
         type: 'RECURRENCE',
         payload: recurrenceId,
      })
      openTunnel(5)
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
            <Tunnel layer={5} size="lg">
               <BrandsTunnel closeTunnel={closeTunnel} />
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
               <Flex direction="row" align="center">
                  <Grid cols="2" style={{ alignItems: 'baseline' }}>
                     <Text as="h1">Recurrences</Text>
                     <div as="title">
                        {type.split('_').map(word => (
                           <Tag>{word[0] + word.slice(1).toLowerCase()}</Tag>
                        ))}
                     </div>
                  </Grid>
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <PlusIcon />
                  </IconButton>
               </Flex>
            </Container>
            <Container top="80" paddingX="32" bottom="64">
               {Boolean(recurrences?.length) && (
                  <>
                     <TableHeader>
                        <span>Recurrences</span>
                        <span>Availability</span>
                        <span>Time Slots</span>
                        {type.includes('PICKUP') && (
                           <span>
                              {type.includes('PREORDER') ? 'Lead' : 'Prep'} Time
                           </span>
                        )}
                        <span>Availability</span>
                        {type.includes('DELIVERY') && (
                           <>
                              <span>Delivery Range</span>
                              <span>
                                 {type.includes('PREORDER') ? 'Lead' : 'Prep'}{' '}
                                 Time
                              </span>
                              <span>Availability</span>
                              <span>Order Value</span>
                              <span>Charges</span>
                           </>
                        )}
                     </TableHeader>
                     {recurrences.map(recurrence => (
                        <TableRecord key={recurrence.id}>
                           <div style={{ padding: '16px' }}>
                              {rrulestr(recurrence.rrule)
                                 .toText()
                                 .replace(/^\w/, char => char.toUpperCase())}
                              <TextButton
                                 type="ghost"
                                 onClick={() => linkWithBrands(recurrence.id)}
                              >
                                 Link with Brands
                              </TextButton>
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
