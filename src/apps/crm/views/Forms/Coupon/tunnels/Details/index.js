import React from 'react'
import { TunnelHeader, Input } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_COUPON } from '../../../../../graphql'
import { TunnelBody, StyledRow } from '../styled'
import { AssetUploader } from '../../../../../../../shared/components'

const DetailsTunnel = ({ state, close }) => {
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

   const addImage = image => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               metaDetails: {
                  ...metaDetails,
                  image: image.url,
               },
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Add details of the coupon"
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
            <StyledRow>
               <Input
                  type="textarea"
                  label="Description"
                  name="textarea"
                  rows="5"
                  value={metaDetails.description}
                  onChange={e =>
                     setMetaDetails({
                        ...metaDetails,
                        description: e.target.value,
                     })
                  }
               />
            </StyledRow>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default DetailsTunnel
