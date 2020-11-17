import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Tunnel, Tunnels, useTunnel, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../shared/utils'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { AssetsTunnel } from '../../tunnels'
import { ImageContainer, PhotoTileWrapper } from './styled'
import { Gallery } from '../../../../../../../../shared/components'

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
      <>
         <Flex width="400px">
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
      </>
   )
}

export default Assets
