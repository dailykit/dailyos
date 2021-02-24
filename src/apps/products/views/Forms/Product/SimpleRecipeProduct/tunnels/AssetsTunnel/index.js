import React from 'react'
import { toast } from 'react-toastify'
import { TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import {
   AssetUploader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { PRODUCT } from '../../../../../../graphql'
import { logger } from '../../../../../../../../shared/utils'
import { TunnelBody } from '../styled'

const AssetsTunnel = ({ state, closeTunnel }) => {
   const [updateProduct] = useMutation(PRODUCT.UPDATE, {
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
            _set: {
               assets: {
                  images: [image],
                  videos: [],
               },
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Select Photo"
            close={() => closeTunnel(1)}
            tooltip={
               <Tooltip identifier="simple_recipe_product_assets_tunnel" />
            }
         />
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
