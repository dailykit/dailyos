import React from 'react'
import { ButtonTile, Tunnels, useTunnel, Tunnel } from '@dailykit/ui'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { ImageContainer, PhotoTileWrapper, Container } from './styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { useTranslation } from 'react-i18next'
import { AssetsTunnel } from '../../tunnels'
const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.assets.'
const Assets = ({ state, openTunnel }) => {
   const { t } = useTranslation()

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('image removed!')))
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   // Handler
   const removeImage = () => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               assets: {
                  images: [],
                  videos: [],
               },
            },
         },
      })
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <AssetsTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Container paddingX="32">
            {state.assets?.images?.length ? (
               <ImageContainer>
                  <div>
                     <span onClick={() => openTunnel(8)}>
                        <EditIcon />
                     </span>
                     <span onClick={removeImage}>
                        <DeleteIcon />
                     </span>
                  </div>
                  <img src={state.assets.images[0]} alt="Inventory Product" />
               </ImageContainer>
            ) : (
               <PhotoTileWrapper>
                  <ButtonTile
                     type="primary"
                     size="sm"
                     text={t(address.concat('add photo to your product'))}
                     helper={t(
                        address.concat('upto 1MB - only JPG, PNG, PDF allowed')
                     )}
                     onClick={() => openTunnel(8)}
                  />
               </PhotoTileWrapper>
            )}
         </Container>
      </>
   )
}

export default Assets
