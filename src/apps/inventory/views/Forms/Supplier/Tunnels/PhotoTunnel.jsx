import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader } from '@dailykit/ui'

import { TunnelContainer } from '../../../../components'
import { AssetUploader } from '../../../../../../shared/components/AssetUploader/index'
import { UPDATE_SUPPLIER } from '../../../../graphql'

export default function PhotoTunnel({ close, formState }) {
   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Image Added!')
         close(1)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(1)
      },
   })

   const addImage = ({ url }) => {
      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               contactPerson: { ...formState.contactPerson, imageUrl: url },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader title="Select Image" close={() => close(1)} />
         <TunnelContainer>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelContainer>
      </>
   )
}
