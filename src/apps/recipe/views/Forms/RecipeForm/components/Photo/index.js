import React from 'react'
import { toast } from 'react-toastify'
import { ButtonTile, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { ImageContainer, PhotoTileWrapper } from './styled'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { Container } from '../styled'
import { PhotoTunnel } from '../../tunnels'

const Photo = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

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
      <>
         {/* Tunnels */}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <PhotoTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Container top="32" paddingX="32">
            {state.image ? (
               <ImageContainer>
                  <div>
                     <span
                        tabIndex="0"
                        role="button"
                        onKeyDown={e => e.charCode === 13 && openTunnel(1)}
                        onClick={() => openTunnel(1)}
                     >
                        <EditIcon />
                     </span>
                     <span
                        tabIndex="0"
                        role="button"
                        onKeyDown={e => e.charCode === 13 && removeImage()}
                        onClick={removeImage}
                     >
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
                     onClick={() => openTunnel(1)}
                  />
               </PhotoTileWrapper>
            )}
         </Container>
      </>
   )
}

export default Photo
