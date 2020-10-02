import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { AssetUploader } from '../AssetUploader'
import { TunnelBody } from './styled'

const Asset = ({ onImageSave, closeTunnel }) => {
   const addImage = image => {
      onImageSave(image.url)
      closeTunnel(2)
   }
   return (
      <>
         <TunnelHeader title="Select Photo" close={() => closeTunnel(2)} />
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default Asset
