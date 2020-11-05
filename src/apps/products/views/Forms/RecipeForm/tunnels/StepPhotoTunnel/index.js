import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { AssetUploader, Tooltip } from '../../../../../../../shared/components'
import { RecipeContext } from '../../../../../context/recipe'
import { TunnelBody } from '../styled'

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
         <TunnelHeader
            title="Select Photo"
            close={() => closeTunnel(2)}
            tooltip={<Tooltip identifier="cooking_step_photo_tunnel" />}
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

export default StepPhotoTunnel
