import React from 'react'
import {
   WrapperDiv,
   Image,
   Images,
   DeleteDiv,
   EditDiv,
   Wrapper,
} from './styled'
import { IconButton, ButtonTile } from '@dailykit/ui'
import { DeleteIcon, EditIcon } from '../../assets/icons'
const PreviewImage = ({
   images,
   current,
   removeImage,
   openTunnel,
   setActive,
   editImage,
}) => {
   return (
      <Wrapper>
         <Images>
            {images.map((img, index) => (
               <WrapperDiv key={`img${index}`}>
                  <Image
                     key={`img${index}`}
                     active={index === current}
                     src={img}
                     alt="small product"
                     onClick={e => e.stopPropagation() || setActive(index)}
                  />
                  <EditDiv active={index === current}>
                     <IconButton
                        size="sm"
                        type="solid"
                        onClick={e =>
                           e.stopPropagation() || editImage(index, true)
                        }
                     >
                        <EditIcon />
                     </IconButton>
                  </EditDiv>

                  <DeleteDiv active={index === current}>
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
            text="Add a Photo"
            onClick={() => openTunnel(1)}
            style={
               images.length
                  ? { marginLeft: '16px', width: '8rem', height: '8rem' }
                  : null
            }
         />
      </Wrapper>
   )
}

export default PreviewImage
