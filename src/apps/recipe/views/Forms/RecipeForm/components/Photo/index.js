import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { ImageContainer, PhotoTileWrapper } from './styled'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { toast } from 'react-toastify'
import { Container } from '../styled'

const Photo = ({ state, openTunnel }) => {
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Image added!')
         // close tunnel
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handler
   const removeImage = () => {
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               image: '',
            },
         },
      })
   }

   return (
      <Container top="32" paddingX="32">
         {state.image ? (
            <ImageContainer>
               <div>
                  <span onClick={() => openTunnel(8)}>
                     <EditIcon />
                  </span>
                  <span onClick={removeImage}>
                     <DeleteIcon />
                  </span>
               </div>
               <img src={state.image} alt="Recipe" />
            </ImageContainer>
         ) : (
            <PhotoTileWrapper>
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add Photo to your Recipe"
                  helper="upto 1MB - only JPG, PNG, PDF allowed"
                  onClick={() => openTunnel(8)}
               />
            </PhotoTileWrapper>
         )}
      </Container>
   )
}

export default Photo
