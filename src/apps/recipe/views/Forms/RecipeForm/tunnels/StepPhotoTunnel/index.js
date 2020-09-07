import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { TunnelBody } from '../styled'
import { AssetUploader } from '../../../../../../../shared/components'
import { RecipeContext } from '../../../../../context/recipee'

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
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </>
   )
}

export default StepPhotoTunnel
