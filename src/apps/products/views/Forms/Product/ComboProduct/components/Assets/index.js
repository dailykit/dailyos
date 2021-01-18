import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Tunnel, Tunnels, useTunnel, Flex } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { UPDATE_COMBO_PRODUCT } from '../../../../../../graphql'
import { AssetsTunnel } from '../../tunnels'
import { ImageContainer, PhotoTileWrapper } from './styled'
import { logger } from '../../../../../../../../shared/utils'
import { Gallery } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.inventoryproduct.components.assets.'
const Assets = ({ state }) => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const [updateProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      onCompleted: () => {
         toast.success('Image updated!')
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
                  images: image,
                  videos: [],
               },
            },
         },
      })
   }

   return (
      <Flex width="100%">
         {state?.assets?.images != null && state?.assets?.images?.length ? (
            <Gallery
               list={state.assets.images}
               isMulti={true}
               onChange={images => {
                  addImage(images)
               }}
            />
         ) : (
            <Gallery
               list={[]}
               isMulti={true}
               onChange={images => {
                  addImage(images)
               }}
            />
         )}
      </Flex>
   )
}

export default Assets
