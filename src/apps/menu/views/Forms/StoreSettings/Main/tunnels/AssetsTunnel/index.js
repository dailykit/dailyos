import React from 'react'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { AssetUploader } from '../../../../../../../../shared/components'
import { UPDATE_STORE_SETTING } from '../../../../../../graphql'

const AssetsTunnel = ({ closeTunnel, updating }) => {
   // Mutation
   const [updateSetting] = useMutation(UPDATE_STORE_SETTING, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(1)
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
