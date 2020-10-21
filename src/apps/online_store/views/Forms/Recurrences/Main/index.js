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
   ComboButton,
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
import { ErrorBoundary, Tooltip } from '../../../../../../shared/components'
import { logger } from '../../../../../../shared/utils'

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
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [deleteRecurrence] = useMutation(DELETE_RECURRENCE, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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

   if (!loading && error)
      return <ErrorBoundary rootRoute="/apps/online-store" />

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
               paddingY="16"
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
                  <ComboButton type="solid" onClick={() => openTunnel(1)}>
                     <PlusIcon /> Create Recurrence
                  </ComboButton>
               </Flex>
            </Container>
            <Container top="80" paddingX="32" bottom="64">
               {Boolean(recurrences?.length) && (
                  <>
                     <TableHeader>
                        <Flex
                           direction="row"
                           align="center"
                           justify="flex-start"
                        >
                           Recurrences
                           <Tooltip identifier="recurrences_table_recurrences" />
                        </Flex>
                        <Flex
                           direction="row"
                           align="center"
                           justify="flex-start"
                        >
                           Availability
                           <Tooltip identifier="recurrences_table_availability" />
                        </Flex>
                        <Flex
                           direction="row"
                           align="center"
                           justify="flex-start"
                        >
                           Time Slots
                           <Tooltip identifier="recurrences_table_time_slots" />
                        </Flex>
                        {type.includes('PICKUP') && (
                           <Flex
                              direction="row"
                              align="center"
                              justify="flex-start"
                           >
                              {type.includes('PREORDER') ? 'Lead' : 'Prep'} Time
                              <Tooltip
                                 identifier={
                                    type.includes('PREORDER')
                                       ? 'recurrences_table_lead_time'
                                       : 'recurrences_table_prep_time'
                                 }
                              />
                           </Flex>
                        )}
                        <Flex
                           direction="row"
                           align="center"
                           justify="flex-start"
                        >
                           Availability
                           <Tooltip identifier="recurrences_table_availability" />
                        </Flex>
                        {type.includes('DELIVERY') && (
                           <>
                              <Flex
                                 direction="row"
                                 align="center"
                                 justify="flex-start"
                              >
                                 Delivery Range
                                 <Tooltip identifier="recurrences_table_delivery_range" />
                              </Flex>
                              <Flex
                                 direction="row"
                                 align="center"
                                 justify="flex-start"
                              >
                                 {type.includes('PREORDER') ? 'Lead' : 'Prep'}{' '}
                                 Time
                                 <Tooltip
                                    identifier={
                                       type.includes('PREORDER')
                                          ? 'recurrences_table_lead_time'
                                          : 'recurrences_table_prep_time'
                                    }
                                 />
                              </Flex>
                              <Flex
                                 direction="row"
                                 align="center"
                                 justify="flex-start"
                              >
                                 Availability
                                 <Tooltip identifier="recurrences_table_availability" />
                              </Flex>
                              <Flex
                                 direction="row"
                                 align="center"
                                 justify="flex-start"
                              >
                                 Order Value
                                 <Tooltip identifier="recurrences_table_order_value" />
                              </Flex>
                              <Flex
                                 direction="row"
                                 align="center"
                                 justify="flex-start"
                              >
                                 Charges
                                 <Tooltip identifier="recurrences_table_charges" />
                              </Flex>
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
