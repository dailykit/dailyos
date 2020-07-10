import React from 'react'
import { Text, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { CloseIcon } from '../../../../assets/icons'

import { Container } from '../styled'
import { TunnelBody, TunnelHeader } from './styled'

import {
   BrandSettings,
   VisualSettings,
   AvailabilitySettings,
} from './components'
import { AssetUploader } from '../../../../../../shared/components'
import { UPDATE_STORE_SETTING } from '../../../../graphql'

const Main = () => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [updating, setUpdating] = React.useState({
      type: 'brand',
      identifier: 'Logo',
   })

   // Mutation
   const [updateSetting] = useMutation(UPDATE_STORE_SETTING, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const addImage = image => {
      if (updating.identifier === 'Slides') {
         updateSetting({
            variables: {
               type: updating.type,
               identifier: updating.identifier,
               value: [...updating.oldValue, image],
            },
         })
      } else {
         updateSetting({
            variables: {
               type: updating.type,
               identifier: updating.identifier,
               value: image,
            },
         })
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <>
                  <TunnelHeader>
                     <div>
                        <span onClick={() => closeTunnel(1)}>
                           <CloseIcon color="#888D9D" size="20" />
                        </span>
                        <Text as="title">Select Photo</Text>
                     </div>
                  </TunnelHeader>
                  <TunnelBody>
                     <AssetUploader
                        onImageSelect={image => addImage(image)}
                        onAssetUpload={url => addImage(url)}
                     />
                  </TunnelBody>
               </>
            </Tunnel>
         </Tunnels>
         <Container paddingX="32" left="300">
            <Text as="h1">Store Settings</Text>
            <Container paddingY="60" bottom="32">
               <BrandSettings
                  setUpdating={setUpdating}
                  openTunnel={openTunnel}
               />
               <VisualSettings
                  setUpdating={setUpdating}
                  openTunnel={openTunnel}
               />
               <AvailabilitySettings />
            </Container>
         </Container>
      </>
   )
}

export default Main
