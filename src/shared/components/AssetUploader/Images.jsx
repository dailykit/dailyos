import React from 'react'
import styled, { css } from 'styled-components'

import { Loader } from '@dailykit/ui'
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
                  <button
                     type="button"
                     onClick={e => e.stopPropagation() || remove(image.key)}
                  >
                     <Trash />
                  </button>
               </StyledListItem>
            ))}
         </StyledList>
      </>
   )
}

export default Images

const StyledList = styled.ul(css`
   height: 100%;
   display: grid;
   padding: 8px;
   grid-gap: 8px;
   grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
   li {
      height: 120px;
      list-style: none;
      overflow: hidden;
      border-radius: 3px;
      border: 1px solid #e3e3e3;
   }
`)

const StyledListItem = styled.li(css`
   position: relative;
   :hover {
      button {
         display: flex;
      }
   }
   button {
      border: none;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 6px;
   }
`)

const StyledImage = styled.img(css`
   width: 100%;
   height: 100%;
   object-fit: contain;
`)

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
