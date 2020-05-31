import React from 'react'
import { Text, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

import { CloseIcon } from '../../../../assets/icons'

import { Container } from '../styled'
import { Fixed, TunnelBody, TunnelHeader } from './styled'

import {
   BrandSettings,
   VisualSettings,
   AvailabilitySettings,
} from './components'
import { AssetUploader } from '../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_STORE_SETTING } from '../../../../graphql'
import { toast } from 'react-toastify'

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
      updateSetting({
         variables: {
            type: updating.type,
            identifier: updating.identifier,
            value: {
               url: image.url,
            },
         },
      })
   }

   return (
      <React.Fragment>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <React.Fragment>
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
               </React.Fragment>
            </Tunnel>
         </Tunnels>
         <Container paddingX="32" left="300">
            <Fixed>
               <Text as="h1">Store Settings</Text>
            </Fixed>
            <Container top="32" bottom="32">
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
      </React.Fragment>
   )
}

export default Main
