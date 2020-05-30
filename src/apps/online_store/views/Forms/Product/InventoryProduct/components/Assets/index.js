import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { ImageContainer, PhotoTileWrapper, Container } from './styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'

const Assets = ({ state, openTunnel }) => {
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Image removed!')
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
                  text="Add Photo to your Product"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => openTunnel(8)}
               />
            </PhotoTileWrapper>
         )}
      </Container>
   )
}

export default Assets
