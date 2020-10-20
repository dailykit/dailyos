import React from 'react'
import { ButtonTile, useTunnel, Tunnels, Tunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { ImageContainer, PhotoTileWrapper, Container } from './styled'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { AssetsTunnel } from '../../tunnels'
import { logger } from '../../../../../../../../shared/utils'

const Assets = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Image removed!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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
            <Tunnel>
               <AssetsTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {state.assets?.images?.length ? (
            <ImageContainer>
               <div>
                  <span
                     role="button"
                     tabIndex="0"
                     onKeyDown={e => e.charCode === 13 && openTunnel(1)}
                     onClick={() => openTunnel(1)}
                  >
                     <EditIcon />
                  </span>
                  <span
                     role="button"
                     tabIndex="0"
                     onKeyDown={e => e.charCode === 13 && removeImage()}
                     onClick={removeImage}
                  >
                     <DeleteIcon />
                  </span>
               </div>
               <img src={state.assets.images[0]} alt="Simple Recipe Product" />
            </ImageContainer>
         ) : (
            <PhotoTileWrapper>
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add Photo to your Product"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => openTunnel(1)}
               />
            </PhotoTileWrapper>
         )}
      </>
   )
}

export default Assets
