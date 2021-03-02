import React from 'react'
import { TunnelHeader, Flex } from '@dailykit/ui'
import {
   AssetUploader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { TunnelBody } from '../../../tunnels/styled'

const ModifierPhotoTunnel = ({ close }) => {
   const {
      modifiersState: { meta },
      modifiersDispatch,
   } = React.useContext(ModifiersContext)

   const addImage = image => {
      modifiersDispatch({
         type: 'OPTION_VALUE',
         payload: {
            field: 'image',
            index: meta.selectedCategoryIndex,
            optionIndex: meta.selectedOptionIndex,
            value: image.url,
         },
      })
      close(5)
   }

   return (
      <>
         <TunnelHeader
            title="Select Photo"
            close={() => close(5)}
            tooltip={<Tooltip identifier="modifier_option_photo_tunnel" />}
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

export default ModifierPhotoTunnel
