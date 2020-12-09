import React from 'react'
import { Menu, MenuOptions, MenuOption } from './style'
import { Context } from '../../state'
import { useDailyGit } from '../../state/mutationFunction'
import moment from 'moment'
import { FileType, FormType } from '../Popup'

const ContextMenu = ({ style, node }) => {
   const { state, dispatch } = React.useContext(Context)
   const [showPopup1, setShowPopup1] = React.useState(false)
   const [showPopup2, setShowPopup2] = React.useState(false)
   const [name, setName] = React.useState('')
   const actionRef = React.useRef('Create')
   const fileType = React.useRef('js')
   const nodeTypeRef = React.useRef(node.type)
   const now = moment().toISOString()
   const {
      createFile,
      createFolder,
      renameFile,
      renameFolder,
      deleteFile,
      deleteFolder,
      recordFile,
      updateRecoredFile,
      deleteRecoredFile,
   } = useDailyGit()
   const mutationHandler = (type, nodeType) => {
      if (type === 'Create') {
         if (nodeType === 'FILE') {
            const filePath = `${node.path.replace(
               /.\/templates/g,
               ''
            )}/${name}.${fileType.current}`
            createFile({
               variables: {
                  path: filePath,
                  content: `Start writing content of file here...`,
               },
            })
            recordFile({
               variables: {
                  object: {
                     fileType: fileType.current,
                     fileName: `${name}.${fileType.current}`,
                     path: filePath,
                     lastSaved: now,
                  },
               },
            })
            fileType.current = ''
         } else {
            const folderPath = `${node.path.replace(
               /.\/templates/g,
               ''
            )}/${name}`
            createFolder({
               variables: {
                  path: folderPath,
               },
            })
         }
      } else if (type === 'Rename') {
         if (nodeType === 'FILE') {
            const oldFilePath = node.path.replace(/.\/templates/g, '')
            const newFilePath = `${oldFilePath.replace(
               /\/([^/]*)$/g,
               ''
            )}/${name}.${oldFilePath.split('.').pop()}`
            renameFile({
               variables: {
                  oldPath: oldFilePath,
                  newPath: newFilePath,
               },
            })
            updateRecoredFile({
               variables: {
                  path: oldFilePath,
                  set: {
                     fileName: `${name}.${oldFilePath.split('.').pop()}`,
                     path: newFilePath,
                     lastSaved: now,
                  },
               },
            })
         } else {
            const oldFolderPath = node.path.replace(/.\/templates/g, '')
            const newFolderPath = `${oldFolderPath.replace(
               /\/([^/]*)$/g,
               ''
            )}/${name}`
            renameFolder({
               variables: {
                  oldPath: oldFolderPath,
                  newPath: newFolderPath,
               },
            })
         }
      } else {
         if (nodeType === 'FILE') {
            const filePath = node.path.replace(/.\/templates/g, '')
            deleteFile({
               variables: {
                  path: filePath,
               },
            })
            deleteRecoredFile({
               variables: {
                  path: filePath,
               },
            })
         } else {
            const folderPath = node.path.replace(/.\/templates/g, '')
            deleteFolder({
               variables: {
                  path: folderPath,
               },
            })
         }
      }
      actionRef.current = 'Create'
      setShowPopup2(!showPopup2)
      setName('')
   }

   const cancelPopup = () => {
      setShowPopup2(!showPopup2)
      actionRef.current = 'Create'
   }

   const stopDot = e => {
      if (e.keyCode === 190 || e.keyCode === 110) {
         e.preventDefault()
      }
   }

   const selectFileType = type => {
      fileType.current = type
      setShowPopup1(!showPopup1)
      setShowPopup2(!showPopup2)
   }

   return (
      <>
         <Menu style={style}>
            <MenuOptions>
               {node.type === 'folder' ? (
                  <>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'file'
                           setShowPopup1(!showPopup1)
                        }}
                     >
                        New File
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'folder'
                           setShowPopup2(!showPopup2)
                        }}
                     >
                        New Folder
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'folder'
                           actionRef.current = 'Rename'
                           setShowPopup2(!showPopup2)
                        }}
                     >
                        Rename Folder
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'folder'
                           actionRef.current = 'Delete'
                           setShowPopup2(!showPopup2)
                        }}
                     >
                        Delete Folder
                     </MenuOption>
                  </>
               ) : (
                  <>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'file'
                           actionRef.current = 'Rename'
                           setShowPopup2(!showPopup2)
                        }}
                     >
                        Rename File
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           nodeTypeRef.current = 'file'
                           actionRef.current = 'Delete'
                           setShowPopup2(!showPopup2)
                        }}
                     >
                        Delete File
                     </MenuOption>
                  </>
               )}
            </MenuOptions>
         </Menu>

         <FileType
            showPopup={showPopup1}
            setShowPopup={() => setShowPopup1(!showPopup1)}
            selectFileType={type => selectFileType(type)}
         />
         <FormType
            showPopup={showPopup2}
            cancelPopup={cancelPopup}
            action={actionRef.current}
            nodeType={nodeTypeRef.current}
            name={name}
            setName={name => setName(name)}
            stopDot={e => stopDot(e)}
            mutationHandler={(action, type) => mutationHandler(action, type)}
         />
      </>
   )
}

export default ContextMenu
