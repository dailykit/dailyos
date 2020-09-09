import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   TunnelHeader,
} from '@dailykit/ui'
import { AssetUploader } from '../AssetUploader'
import { TunnelBody } from './styled'

const Asset = ({ onImageSave }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const addImage = image => {
      onImageSave(image.url)
      closeTunnel(1)
   }
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Select Photo"
                  close={() => closeTunnel(1)}
               />
               <TunnelBody>
                  <AssetUploader
                     onImageSelect={image => addImage(image)}
                     onAssetUpload={url => addImage(url)}
                  />
               </TunnelBody>
            </Tunnel>
         </Tunnels>

         <ButtonTile
            type="primary"
            size="sm"
            text="Add a Photo"
            helper="upto 1MB - only JPG, PNG, PDF allowed"
            onClick={() => openTunnel(1)}
            style={{ margin: '20px 0' }}
         />
      </>
   )
}

export default Asset

// Made by Deepak Negi
