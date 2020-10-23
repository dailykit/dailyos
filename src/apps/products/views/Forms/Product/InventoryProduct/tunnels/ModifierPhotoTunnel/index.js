import React from 'react'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../../shared/components'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

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
         <TunnelHeader title="Select Photo" close={() => close(5)} />
         <Flex padding="0 14px">
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </Flex>
      </>
   )
}

export default ModifierPhotoTunnel
