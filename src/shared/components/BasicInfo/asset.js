import React from 'react'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../AssetUploader'

const Asset = ({ onImageSave, closeTunnel }) => {
   const addImage = image => {
      onImageSave(image.url)
      closeTunnel(2)
   }
   return (
      <>
         <TunnelHeader title="Select Photo" close={() => closeTunnel(2)} />
         <Flex padding="0 14px">
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </Flex>
      </>
   )
}

export default Asset
