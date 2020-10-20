import React from 'react'
import { TunnelHeader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components'
import { RecipeContext } from '../../../../../context/recipe'

const StepPhotoTunnel = ({ closeTunnel }) => {
   const { recipeState, recipeDispatch } = React.useContext(RecipeContext)

   const addImage = image => {
      recipeDispatch({
         type: 'ADD_STEP_PHOTO',
         payload: {
            assets: {
               images: [image],
               videos: [],
            },
            index: recipeState.procedureIndex,
            stepIndex: recipeState.stepIndex,
         },
      })
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

export default StepPhotoTunnel
