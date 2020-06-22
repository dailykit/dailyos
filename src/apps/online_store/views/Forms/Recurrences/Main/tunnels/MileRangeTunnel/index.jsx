import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { Text, Input, TunnelHeader } from '@dailykit/ui'

import { TunnelBody, StyledRow } from '../styled'
import { Grid } from '../../../styled'
import { CREATE_MILE_RANGES } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Context } from '../../../../../../context'

const MileRangeTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const {
      state: { current },
   } = React.useContext(Context)
   const [busy, setBusy] = React.useState(false)
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [time, setTime] = React.useState('')

   // Mutation
   const [createMileRanges] = useMutation(CREATE_MILE_RANGES, {
      onCompleted: () => {
         toast.success('Mile range added!')
         closeTunnel(3)
      },
      onError: () => {
         setBusy(false)
         toast.error('Error')
      },
   })

   // Handlers
   const save = () => {
      setBusy(true)
      if (isNaN(time)) {
         setBusy(false)
         return toast.error('Invalid time!')
      }
      if (isNaN(from)) {
         setBusy(false)
         return toast.error('From value invalid!')
      }
      if (isNaN(to)) {
         setBusy(false)
         return toast.error('To value invalid!')
      }
      createMileRanges({
         variables: {
            objects: [
               {
                  timeSlotId: recurrenceState.timeSlotId,
                  from,
                  to,
                  prepTime: current.fulfillment.includes('ONDEMAND')
                     ? time
                     : null,
                  leadTime: current.fulfillment.includes('PREORDER')
                     ? time
                     : null,
               },
            ],
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Add Mile Range"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(3)}
         />
         <TunnelBody>
            <StyledRow>
               <Text as="p">
                  Enter Mile Range and{' '}
                  {current.fulfillment.includes('PREORDER') ? 'Lead' : 'Prep'}{' '}
                  Time:
               </Text>
            </StyledRow>
            <StyledRow>
               <Grid cols="3" gap="16">
                  <Input
                     type="text"
                     label="From"
                     name="from"
                     value={from}
                     onChange={e => setFrom(e.target.value)}
                  />
                  <Input
                     type="text"
                     label="To"
                     name="to"
                     value={to}
                     onChange={e => setTo(e.target.value)}
                  />
                  <Input
                     type="text"
                     label={
                        current.fulfillment.includes('PREORDER')
                           ? 'Lead Time(minutes)'
                           : 'Prep Time(minutes)'
                     }
                     name="time"
                     value={time}
                     onChange={e => setTime(e.target.value)}
                  />
               </Grid>
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default MileRangeTunnel
