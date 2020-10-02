import React from 'react'
import styled, { css } from 'styled-components'
import { Input } from '@dailykit/ui'

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
         <StyledForm>
            <fieldset>
               <Input
                  type="text"
                  name="title"
                  label="title"
                  value={file.title}
                  onChange={e => handleMetaChange(e)}
               />
            </fieldset>
            <fieldset>
               <Input
                  row={5}
                  type="textarea"
                  name="description"
                  label="description"
                  value={file.description}
                  onChange={e => handleMetaChange(e)}
               />
            </fieldset>
            <fieldset>
               <input
                  type="file"
                  ref={inputRef}
                  name="file"
                  onChange={handleChange}
               />
            </fieldset>
            <button type="button" onClick={() => handleSubmit()}>
               Upload
            </button>
         </StyledForm>
         {file.preview && (
            <StyledSection>
               {file.raw.type && (
                  <StyledImage src={file.preview} alt={file.raw.name} />
               )}
               <button type="button" onClick={() => clearSelected()}>
                  <Trash />
               </button>
               <p>{file.raw.name}</p>
            </StyledSection>
         )}
      </div>
   )
}

const StyledSection = styled.section(css`
   width: 180px;
   margin: 16px;
   position: relative;
   :hover {
      button {
         display: flex;
      }
   }
   p {
      margin: 0;
   }
   button {
      border: none;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      padding: 6px;
      top: 4px;
      right: 4px;
   }
`)

const StyledForm = styled.div(css`
   display: flex;
   padding: 14px;
   flex-direction: column;
   fieldset {
      border: none;
      margin-bottom: 16px;
      [type='file'] {
         width: inherit;
         padding: 8px;
         border: 1px solid #e3e3e3;
      }
   }
   button {
      height: 36px;
      border: none;
      color: #fff;
      font-size: 16px;
      padding: 0 14px;
      margin-left: 16px;
      border-radius: 3px;
      background: #37d0b3;
      align-self: flex-start;
   }
`)

const StyledImage = styled.img(css`
   height: 64px;
   object-fit: cover;
   border-radius: 8px;
   border: 1px solid #e3e3e3;
`)

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
