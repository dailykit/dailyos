import React from 'react'
import { Text } from '@dailykit/ui'
import { CloseIcon } from '../../../../../../assets/icons'
import { AssetUploader } from '../../../../../../../../shared/components'
import { TunnelHeader, TunnelBody } from '../styled'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
const address = 'apps.online_store.views.forms.product.inventoryproduct.tunnels.assetstunnel.'
const AssetsTunnel = ({ state, closeTunnel }) => {
   const { t } = useTranslation()
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('image added!')))
         closeTunnel(8)
      },
      onError: error => {
         console.log(error)
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(8)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">{t(address.concat('select photo'))}</Text>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelBody>
      </React.Fragment>
   )
}

export default AssetsTunnel
