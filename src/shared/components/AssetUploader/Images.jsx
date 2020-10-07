import React from 'react'
import styled from 'styled-components'
import { Loader, Spacer, IconButton } from '@dailykit/ui'

import useAssets from './useAssets'

const Images = ({ onImageSelect }) => {
   const { images, status, error, remove } = useAssets('images')

   if (status === 'LOADING') return <Loader />
   if (status === 'ERROR') return <div>{error}</div>
   return (
      <>
         <StyledList>
            {images.map(image => (
               <StyledListItem
                  key={image.key}
                  title={image.metadata.title}
                  onClick={() => onImageSelect(image)}
               >
                  <StyledImage src={image.url} alt={image.metadata.title} />
                  <span>
                     <IconButton
                        size="sm"
                        type="solid"
                        onClick={e => e.stopPropagation() || remove(image.key)}
                     >
                        <Trash />
                     </IconButton>
                  </span>
               </StyledListItem>
            ))}
         </StyledList>
         <Spacer size="14px" />
      </>
   )
}

export default Images

const StyledList = styled.ul`
   display: grid;
   grid-gap: 8px;
   grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
   li {
      height: 120px;
      list-style: none;
      overflow: hidden;
      border-radius: 3px;
      border: 1px solid #e3e3e3;
   }
`

const StyledListItem = styled.li`
   position: relative;
   span {
      top: 6px;
      right: 6px;
      display: none;
      position: absolute;
   }
   :hover span {
      display: block;
   }
`

const StyledImage = styled.img`
   width: 100%;
   height: 100%;
   object-fit: contain;
`

const Trash = ({ size = 16, color = '#ffffff' }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
   </svg>
)
