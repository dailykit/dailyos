import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components'
import { UPDATE_RECIPE } from '../../../../../graphql'

const PhotoTunnel = ({ state, closeTunnel }) => {
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error')
      },
   })

   const addImage = image => {
      updateRecipe({
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
         <Flex padding="0 14px">
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </Flex>
      </>
   )
}

export default PhotoTunnel
