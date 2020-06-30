import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components/AssetUploader/index'
import { TunnelContainer } from '../../../../../components'
import { UPDATE_PACKAGING } from '../../../../../graphql'

export default function PhotoTunnel({ close, state }) {
   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         close(1)
         toast.info('Packaging Image added !')
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(1)
      },
   })

   const addImage = ({ url }) => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               image: url,
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
