import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../../graphql'
import { StyledRow, TunnelBody } from '../../styled'

const TitleTunnel = ({ state, close }) => {
   const [busy, setBusy] = React.useState(false)
   const [metaDetails, setMetaDetails] = React.useState(
      state?.metaDetails || ''
   )

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COUPON, {
      variables: {
         id: state.id,
         set: {
            metaDetails,
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
            title="Add Title"
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
                  label="Title"
                  name="textarea"
                  rows="5"
                  value={metaDetails.title}
                  onChange={e =>
                     setMetaDetails({ ...metaDetails, title: e.target.value })
                  }
               />
            </StyledRow>
         </TunnelBody>
      </>
   )
}

export default TitleTunnel
