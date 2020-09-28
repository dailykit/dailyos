import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { TunnelBody } from '../styled'
import { AssetUploader } from '../../../../../../../../shared/components'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

const ModifierPhotoTunnel = ({ close }) => {
   const {
      modifiersState: { meta },
      modifiersDispatch,
   } = React.useContext(ModifiersContext)

   const addImage = image => {
      modifiersDispatch({
         type: 'EDIT_CATEGORY_OPTION',
         payload: {
            label: 'image',
            index: meta.selectedCategoryIndex,
            optionIndex: meta.selectedOptionIndex,
            value: image.url,
         },
      })
      close(5)
   }

   return (
      <>
         <TunnelHeader title="Select Photo" close={() => close(5)} />
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default ModifierPhotoTunnel
