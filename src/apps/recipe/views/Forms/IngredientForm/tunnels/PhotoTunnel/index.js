import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components'
import { TunnelBody } from '../styled'
import { UPDATE_INGREDIENT } from '../../../../../graphql'

const PhotoTunnel = ({ state, closeTunnel }) => {
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error')
      },
   })

   const addImage = image => {
      updateIngredient({
         variables: {
            id: state.id,
            set: {
               image: image.url,
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader title="Select Photo" close={() => closeTunnel(1)} />
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default PhotoTunnel
