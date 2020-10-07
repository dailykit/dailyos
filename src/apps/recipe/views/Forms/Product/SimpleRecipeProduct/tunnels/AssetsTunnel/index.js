import React from 'react'
import { toast } from 'react-toastify'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { AssetUploader } from '../../../../../../../../shared/components'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'

const AssetsTunnel = ({ state, closeTunnel }) => {
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(1)
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

export default AssetsTunnel
