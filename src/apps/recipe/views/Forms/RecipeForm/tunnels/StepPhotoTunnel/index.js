import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { TunnelBody } from '../styled'
import { AssetUploader } from '../../../../../../../shared/components'
import { RecipeContext } from '../../../../../context/recipee'
import { UPDATE_RECIPE } from '../../../../../graphql'

const StepPhotoTunnel = ({ state, closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Image added!')
         closeTunnel(2)
      },
      onError: () => {
         toast.error('Error')
      },
   })

   const addImage = image => {
      const { procedures } = state
      procedures[recipeState.procedureIndex].steps[
         recipeState.stepIndex
      ].assets = {
         images: [image],
         videos: [],
      }
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               procedures,
            },
         },
      })
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
