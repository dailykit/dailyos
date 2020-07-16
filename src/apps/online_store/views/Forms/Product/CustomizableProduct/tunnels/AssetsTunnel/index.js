import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { AssetUploader } from '../../../../../../../../shared/components'
import { TunnelBody } from '../styled'
import { UPDATE_CUSTOMIZABLE_PRODUCT } from '../../../../../../graphql'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.assetstunnel.'
const AssetsTunnel = ({ state, closeTunnel }) => {
   const { t } = useTranslation()
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('image added!')))
         closeTunnel(1)
      },
      onError: () => {
         toast.error(t(address.concat('error')))
      },
   })

   const addImage = image => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               assets: {
                  images: [image.url],
                  videos: [],
               },
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select photo'))}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={image => addImage(image)}
            />
         </TunnelBody>
      </>
   )
}

export default AssetsTunnel
