import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { Text, Input, TunnelHeader } from '@dailykit/ui'
import { useParams } from 'react-router-dom'

import { TunnelBody, StyledRow } from '../styled'
import { Grid } from '../../../styled'
import { CREATE_MILE_RANGES } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'

const MileRangeTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const { type } = useParams()
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
      if (Number.isNaN(time)) {
         setBusy(false)
         return toast.error('Invalid time!')
      }
      if (Number.isNaN(from)) {
         setBusy(false)
         return toast.error('From value invalid!')
      }
      if (Number.isNaN(to)) {
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
                  prepTime: type.includes('ONDEMAND') ? time : null,
                  leadTime: type.includes('PREORDER') ? time : null,
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
                  {type.includes('PREORDER') ? 'Lead' : 'Prep'} Time:
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
                        type.includes('PREORDER')
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
