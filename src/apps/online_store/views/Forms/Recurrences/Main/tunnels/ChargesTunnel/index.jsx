import React from 'react'
import { Text, TextButton, Input } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { Grid } from '../../../styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { CREATE_CHARGES } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Context } from '../../../../../../context'

const ChargesTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const {
      state: { current },
   } = React.useContext(Context)
   const [busy, setBusy] = React.useState(false)
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [charge, setCharge] = React.useState('')

   // Mutation
   const [createCharges] = useMutation(CREATE_CHARGES, {
      onCompleted: () => {
         toast.success('Charge added!')
         closeTunnel(4)
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
      if (isNaN(charge)) {
         setBusy(false)
         return toast.error('Invalid charge!')
      }
      if (isNaN(from)) {
         setBusy(false)
         return toast.error('From value invalid!')
      }
      if (isNaN(to)) {
         setBusy(false)
         return toast.error('To value invalid!')
      }
      if (recurrenceState.charge) {
         console.log('Update')
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(4)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Delivery Charges</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
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
         </TunnelBody>
      </React.Fragment>
   )
}

export default ChargesTunnel
