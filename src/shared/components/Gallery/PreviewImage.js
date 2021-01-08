import React from 'react'
import { WrapperDiv, Image, Images, DeleteDiv, Wrapper } from './styled'
import { IconButton, ButtonTile } from '@dailykit/ui'
import { DeleteIcon } from '../../assets/icons'
const PreviewImage = ({ images, removeImage, openTunnel, editImage }) => {
   return (
      <Wrapper>
         <Images>
            {images.map((img, index) => (
               <WrapperDiv key={`img${index}`}>
                  <Image
                     key={`img${index}`}
                     src={img}
                     alt="small product"
                     onClick={e =>
                        e.stopPropagation() || editImage(index, true)
                     }
                  />
                  <DeleteDiv active={true}>
                     <IconButton
                        size="sm"
                        type="solid"
                        onClick={e => e.stopPropagation() || removeImage(index)}
                     >
                        <DeleteIcon />
                     </IconButton>
                  </DeleteDiv>
               </WrapperDiv>
            ))}
         </Images>
         <ButtonTile
            type="primary"
            size="sm"
            text={!images.length ? 'Add a Photo' : null}
            onClick={() => openTunnel(1)}
            style={
               images.length
                  ? { marginLeft: '16px', width: '4.25rem', height: '4.25rem' }
                  : null
            }
         />
      </Wrapper>
   )
}

export default PreviewImage
