import React from 'react'
import { Text, TextButton, Input } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { Grid } from '../../../styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
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
      onError: error => {
         setBusy(false)
         toast.error('Error')
         console.log(error)
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(3)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Mile Range</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
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
                           ? 'Lead Time(hours)'
                           : 'Prep Time(hours)'
                     }
                     name="time"
                     value={time}
                     onChange={e => setTime(e.target.value)}
                  />
               </Grid>
            </StyledRow>
         </TunnelBody>
      </React.Fragment>
   )
}

export default MileRangeTunnel
