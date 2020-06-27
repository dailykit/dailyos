import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { Text, Input, TunnelHeader, Toggle, HelperText } from '@dailykit/ui'

import { TunnelBody, StyledRow } from '../styled'
import { Grid } from '../../../styled'
import { CREATE_CHARGES, UPDATE_CHARGE } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'

const ChargesTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const [busy, setBusy] = React.useState(false)
   const [from, setFrom] = React.useState(
      recurrenceState?.charge?.orderValueFrom || ''
   )
   const [to, setTo] = React.useState(
      recurrenceState?.charge?.orderValueUpto || ''
   )
   const [auto] = React.useState(
      recurrenceState?.charge?.autoDeliverySelection || false
   )
   const [charge, setCharge] = React.useState(
      recurrenceState?.charge?.charge || ''
   )

   // Mutation
   const [createCharges] = useMutation(CREATE_CHARGES, {
      onCompleted: () => {
         toast.success('Charge added!')
         closeTunnel(4)
      },
      onError: () => {
         setBusy(false)
         toast.error('Error')
      },
   })

   const [updateCharge] = useMutation(UPDATE_CHARGE, {
      onCompleted: () => {
         toast.success('Charge Updated!')
         closeTunnel(4)
      },
      onError: () => {
         setBusy(false)
         toast.error('Error')
      },
   })

   // Handlers
   const save = () => {
      setBusy(true)
      if (Number.isNaN(charge) || charge === 0) {
         setBusy(false)
         return toast.error('Invalid charge!')
      }
      if (Number.isNaN(from) || from === 0) {
         setBusy(false)
         return toast.error('From value invalid!')
      }
      if (Number.isNaN(to) || to === 0) {
         setBusy(false)
         return toast.error('To value invalid!')
      }
      if (recurrenceState.charge) {
         updateCharge({
            variables: {
               id: recurrenceState.charge.id,
               set: {
                  orderValueFrom: from,
                  orderValueUpto: to,
                  charge,
               },
            },
         })
      } else {
         createCharges({
            variables: {
               objects: {
                  mileRangeId: recurrenceState.mileRangeId,
                  orderValueFrom: from,
                  orderValueUpto: to,
                  charge,
               },
            },
         })
      }
   }

   return (
      <>
         <TunnelHeader
            title="Add Delivery Charges"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(4)}
         />
         <TunnelBody>
            <StyledRow>
               <Text as="p">Enter Order Value Range and Charges:</Text>
            </StyledRow>
            <StyledRow>
               <Grid cols="3" gap="16">
                  <Input
                     type="text"
                     label="Order Value From"
                     name="from"
                     value={from}
                     onChange={e => setFrom(e.target.value)}
                  />
                  <Input
                     type="text"
                     label="Order Value Upto"
                     name="to"
                     value={to}
                     onChange={e => setTo(e.target.value)}
                  />
                  <Input
                     type="text"
                     label="Charge"
                     name="charge"
                     value={charge}
                     onChange={e => setCharge(e.target.value)}
                  />
               </Grid>
            </StyledRow>
            <section>
               <Toggle
                  checked={auto}
                  setChecked={() => {}}
                  label="Handle delivery automatically?"
               />
               <HelperText type="hint" message="Coming Soon!" />
            </section>
         </TunnelBody>
      </>
   )
}

export default ChargesTunnel
