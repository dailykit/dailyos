import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useTunnel, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../shared/utils'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { Gallery } from '../../../../../../../../shared/components'

const Assets = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
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
