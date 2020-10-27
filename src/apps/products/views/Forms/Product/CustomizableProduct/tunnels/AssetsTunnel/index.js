import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   AssetUploader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import { UPDATE_CUSTOMIZABLE_PRODUCT } from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.menu.views.forms.product.customizableproduct.tunnels.assetstunnel.'
const AssetsTunnel = ({ state, closeTunnel }) => {
   const { t } = useTranslation()
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('image added!')))
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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
            tooltip={
               <Tooltip identifier="customizable_product_assets_tunnel" />
            }
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

export default AssetsTunnel
