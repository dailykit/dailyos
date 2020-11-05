import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Flex, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { DeleteIcon, EditIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { PhotoTunnel } from '../../tunnels'
import { ImageContainer, PhotoTileWrapper } from './styled'

const Photo = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
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
         <Flex>
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
                     helper="upto 1MB - only JPG & PNG allowed"
                     onClick={() => openTunnel(1)}
                  />
               </PhotoTileWrapper>
            )}
         </Flex>
      </>
   )
}

export default Photo
