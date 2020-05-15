import React from 'react'
import styled, { css } from 'styled-components'
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
               <legend>Title</legend>
               <input
                  type="text"
                  name="title"
                  value={file.title}
                  placeholder="Enter the title"
                  onChange={e => handleMetaChange(e)}
               />
            </fieldset>
            <fieldset>
               <legend>Description</legend>
               <textarea
                  row="4"
                  name="description"
                  value={file.description}
                  placeholder="Enter the description"
                  onChange={e => handleMetaChange(e)}
               />
            </fieldset>
            <fieldset>
               <legend>Select Image</legend>
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
               <StyledImage src={file.preview} alt="bleh" />
               <button type="button" onClick={() => clearSelected()}>
                  <Trash />
               </button>
            </StyledSection>
         )}
      </div>
   )
}

const StyledSection = styled.section(css`
   width: 180px;
   margin-top: 16px;
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
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      padding: 6px;
      top: 4px;
      right: 4px;
   }
`)

const StyledForm = styled.div(css`
   display: flex;
   flex-direction: column;
   border: 1px solid #d7d7d7;
   padding: 8px;
   border-radius: 8px;
   fieldset {
      padding: 4px 8px;
      margin-bottom: 12px;
      border: 1px solid #d7d7d7;
   }
   legend {
      padding: 0 6px;
   }
   input,
   textarea {
      width: 100%;
      padding: 4px;
      border: none;
      font-size: 14px;
   }
   button {
      height: 32px;
      border: none;
      color: #fff;
      font-size: 16px;
      padding: 0 12px;
      border-radius: 8px;
      background: #37d0b3;
      align-self: flex-start;
   }
`)

const StyledImage = styled.img(css`
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 8px;
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
