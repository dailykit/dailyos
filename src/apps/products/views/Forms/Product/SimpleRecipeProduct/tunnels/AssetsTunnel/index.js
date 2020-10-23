import React from 'react'
import { toast } from 'react-toastify'
import { TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { AssetUploader } from '../../../../../../../../shared/components'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { logger } from '../../../../../../../../shared/utils'
import { TunnelBody } from '../styled'

const AssetsTunnel = ({ state, closeTunnel }) => {
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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
         <TunnelHeader title="Select Photo" close={() => closeTunnel(1)} />
         <TunnelBody>
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </TunnelBody>
      </>
   )
}

export default AssetsTunnel
