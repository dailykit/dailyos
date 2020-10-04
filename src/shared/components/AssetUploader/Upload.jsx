import React from 'react'
import styled, { css } from 'styled-components'
import { Input, TextButton, IconButton, Spacer, Text } from '@dailykit/ui'

import useAssets from './useAssets'

const Upload = ({ onAssetUpload }) => {
   const { upload } = useAssets()
   const inputRef = React.useRef(null)
   const [file, setFile] = React.useState({
      title: '',
      preview: null,
      raw: null,
      description: '',
   })

   const handleChange = e => {
      setFile({
         ...file,
         raw: e.target.files[0],
         preview: URL.createObjectURL(e.target.files[0]),
      })
   }

   const clearSelected = () => {
      setFile({ preview: null, raw: null, title: '', description: '' })
      inputRef.current.value = null
   }

   const handleSubmit = async () => {
      const data = await upload({
         clearSelected,
         file: file.raw,
         title: file.title,
         description: file.description,
      })
      onAssetUpload(data)
   }

   const handleMetaChange = e => {
      const { name, value } = e.target

      setFile({
         ...file,
         [name]: value,
      })
   }

   return (
      <div>
         <Text as="title">Title</Text>
         <Input
            label=""
            type="text"
            name="title"
            value={file.title}
            placeholder="Enter the image title"
            onChange={e => handleMetaChange(e)}
         />
         <Spacer size="24px" />
         <Text as="title">Description</Text>
         <Input
            row={5}
            label=""
            type="textarea"
            name="description"
            value={file.description}
            onChange={e => handleMetaChange(e)}
            placeholder="Enter the image description"
         />
         <Spacer size="24px" />
         <FileInput
            type="file"
            ref={inputRef}
            name="file"
            onChange={handleChange}
         />
         <Spacer size="16px" />
         <TextButton type="solid" onClick={() => handleSubmit()}>
            Upload
         </TextButton>
         <Spacer size="24px" />
         <Text as="title">Selected Images</Text>
         <Spacer size="8px" />
         {file.preview ? (
            <StyledSection>
               {file.raw.type && (
                  <StyledImage src={file.preview} alt={file.raw.name} />
               )}
               <span>
                  <IconButton
                     size="sm"
                     type="solid"
                     onClick={() => clearSelected()}
                  >
                     <Trash />
                  </IconButton>
               </span>
               <Spacer size="4px" />
               <Text as="p">{file.raw.name}</Text>
            </StyledSection>
         ) : (
            <span>No images selected!</span>
         )}
      </div>
   )
}

const StyledSection = styled.section`
   width: 120px;
   position: relative;
   span {
      position: absolute;
      top: 6px;
      right: 6px;
   }
`

const FileInput = styled.input`
   width: 100%;
   padding: 12px;
   border-radius: 2px;
   border: 1px solid #e3e3e3;
`

const StyledImage = styled.img`
   height: 120px;
   object-fit: cover;
   border-radius: 8px;
   border: 1px solid #e3e3e3;
`

const Trash = ({ size = 18, color = '#ffffff' }) => (
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

export default Upload
