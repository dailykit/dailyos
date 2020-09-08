import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
   Text,
} from '@dailykit/ui'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { DetailsTunnel } from '../../tunnels'
import { UPDATE_COUPON } from '../../../../../graphql'
import { EditIcon, DeleteIcon } from '../../../../../../../shared/assets/icons'
import { StyledContainer, StyledRow, ImageContainer } from '../styled'

const Description = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [busy, setBusy] = React.useState(false)

   // Mutations
   const [updateProduct] = useMutation(UPDATE_COUPON, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   // Handlers
   const removeImage = () => {
      if (busy) return
      setBusy(true)
      updateProduct({
         variables: {
            id: state.id,
            set: {
               metaDetails: {
                  ...state.metaDetails,
                  images: '',
               },
            },
         },
      })
   }
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DetailsTunnel state={state} close={() => closeTunnel(1)} />
            </Tunnel>
         </Tunnels>
         {state?.metaDetails?.title ||
         state?.metaDetails?.description ||
         state?.metaDetails?.image ? (
            <>
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
                  <img src={state?.metaDetails?.image} alt="Coupon" />
               </ImageContainer>
               <StyledContainer>
                  <Text as="title">Title</Text>
                  <StyledRow>
                     <Text as="p">{state?.metaDetails?.title}</Text>
                     <IconButton type="outline" onClick={() => openTunnel(1)}>
                        <EditIcon />
                     </IconButton>
                  </StyledRow>
               </StyledContainer>
               <StyledContainer>
                  <Text as="title">Description</Text>
                  <StyledRow>
                     <Text as="p">{state?.metaDetails?.description}</Text>
                     <IconButton type="outline" onClick={() => openTunnel(1)}>
                        <EditIcon />
                     </IconButton>
                  </StyledRow>
               </StyledContainer>
            </>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Details"
               style={{ margin: '20px 0' }}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Description
