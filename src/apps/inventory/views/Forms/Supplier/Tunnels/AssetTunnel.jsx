import React from 'react'
import { toast } from 'react-toastify'
import { TunnelHeader } from '@dailykit/ui'
import { TunnelContainer } from '../../../../components'
import { AssetUploader } from '../../../../../../shared/components/AssetUploader/index'

export default function AssetTunnel({ close }) {
   const addImage = ({ url }) => {
      console.log(url)
   }

   return (
      <>
         <TunnelHeader title="Select Photo" close={() => close(1)} />
         <TunnelContainer>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage({ url })}
            />
         </TunnelContainer>
      </>
   )
}
