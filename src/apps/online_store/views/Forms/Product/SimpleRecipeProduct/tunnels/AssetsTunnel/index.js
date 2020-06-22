import React from 'react'
import { toast } from 'react-toastify'
import { TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { AssetUploader } from '../../../../../../../../shared/components'
import { TunnelBody } from '../styled'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'

const AssetsTunnel = ({ state, closeTunnel }) => {
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(7)
      },
      onError: () => {
         toast.error('Error')
      },
   })

   const addImage = image => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               assets: {
                  images: [image.url],
                  videos: [],
               },
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader title="Select Photo" close={() => closeTunnel(7)} />
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default AssetsTunnel
