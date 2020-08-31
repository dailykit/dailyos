import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { Text, Input, TunnelHeader } from '@dailykit/ui'

import { TunnelBody, StyledRow } from '../styled'
import { Container, Flex } from '../../../styled'
import { CREATE_TIME_SLOTS } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'

const TimeSlotTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const { type } = useParams()
   const [busy, setBusy] = React.useState(false)
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [advance, setAdvance] = React.useState('')

   // Mutation
   const [createTimeSlots] = useMutation(CREATE_TIME_SLOTS, {
      onCompleted: () => {
         toast.success('Time slot added!')
         closeTunnel(2)
      },
      onError: () => {
         setBusy(false)
         toast.error('Error')
      },
   })

   // Handlers
   const save = () => {
      setBusy(true)
      if (Number.isNaN(advance) && type.includes('PICKUP')) {
         setBusy(false)
         return toast.error('Invalid time!')
      }
      createTimeSlots({
         variables: {
            objects: [
               {
                  recurrenceId: recurrenceState.recurrenceId,
                  from,
                  to,
                  pickUpLeadTime: type === 'PREORDER_PICKUP' ? advance : null,
                  pickUpPrepTime: type === 'ONDEMAND_PICKUP' ? advance : null,
               },
            ],
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Add Time Slot"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(2)}
         />
         <TunnelBody>
            <StyledRow>
               <Text as="p">Enter time slot:</Text>
            </StyledRow>
            <StyledRow>
               <Flex direction="row" justify="flex-start">
                  <label style={{ marginRight: '16px' }}>
                     From
                     <input
                        style={{ marginLeft: '8px' }}
                        type="time"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                     />
                  </label>
                  <span style={{ marginRight: '16px' }}>-</span>
                  <label>
                     To
                     <input
                        style={{ marginLeft: '8px' }}
                        type="time"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                     />
                  </label>
               </Flex>
               {type.includes('PICKUP') && (
                  <Container top="32">
                     <Input
                        type="number"
                        label={`${
                           type.includes('ONDEMAND') ? 'Prep' : 'Lead'
                        } Time(minutes)`}
                        value={advance}
                        onChange={e => setAdvance(e.target.value)}
                     />
                  </Container>
               )}
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default TimeSlotTunnel
