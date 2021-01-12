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
