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
      const oldImages = state.images && state.images.length ? state.images : []
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               assets: {
                  images: [url, ...oldImages],
               },
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
