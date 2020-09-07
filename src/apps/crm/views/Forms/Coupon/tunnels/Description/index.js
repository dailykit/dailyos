import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../graphql'
import { StyledRow, TunnelBody } from '../styled'

const DescriptionTunnel = ({ state, close }) => {
   const [busy, setBusy] = React.useState(false)
   const [description, setDescription] = React.useState(state.description || '')

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COUPON, {
      variables: {
         id: state.id,
         set: {
            description,
         },
      },
      onCompleted: () => {
         toast.success('Updated!')
         close(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

   return (
      <>
         <TunnelHeader
            title="Add description"
            right={{
               action: save,
               title: busy ? 'Saving' : 'Save',
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <StyledRow>
               <Input
                  type="textarea"
                  label="Description"
                  name="textarea"
                  rows="5"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
               />
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default DescriptionTunnel
