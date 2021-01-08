import React from 'react'
import { Menu, MenuOptions, MenuOption } from './style'
import { Spacer } from '@dailykit/ui'
import {
   CreateFile,
   CreateFolder,
   DeleteIcon,
   EditIcon,
   CopyIcon,
} from '../../assets/Icons'
import { useDailyGit } from '../../state/mutationFunction'
import { useGlobalContext } from '../../context'
import moment from 'moment'
import { FileType, FormType } from '../Popup'
import { toast } from 'react-toastify'

const ContextMenu = ({ style, node, treeViewData }) => {
   const { setPopupInfo, setContextMenuInfo } = useGlobalContext()
   const [showPopup1, setShowPopup1] = React.useState(false)
   const [showPopup2, setShowPopup2] = React.useState(false)
   const [name, setName] = React.useState('')
   const [path, setPath] = React.useState('')
   const actionRef = React.useRef('Create')
   const fileType = React.useRef('js')
   const nodeTypeRef = React.useRef(node.type)
   const now = moment().toISOString()
   const options = [
      { id: 'cr-file', value: 'New File', type: 'file', action: 'create' },
      { id: 'cr-fold', value: 'New Folder', type: 'folder', action: 'create' },
      { id: 'rn-file', value: 'Rename File', type: 'file', action: 'rename' },
      {
         id: 'rn-fold',
         value: 'Rename Folder',
         type: 'folder',
         action: 'rename',
      },
      { id: 'dl-file', value: 'Delete File', type: 'file', action: 'delete' },
      {
         id: 'dl-fold',
         value: 'Delete Folder',
         type: 'folder',
         action: 'delete',
      },
      { id: 'cp-file', value: 'Copy File Path', type: 'file', action: 'copy' },
   ]

   const copyToClipboard = () => {
      const relativePath = node.path.replace(
         process.env.REACT_APP_ROOT_FOLDER,
         ''
      )
      const fileUrl = `https://test.dailykit.org/template/files${relativePath}`
      navigator.clipboard.writeText(fileUrl).then(
         () => {
            toast.success('Copied!')
         },
         () => {
            toast.error('Something went wrong!')
         }
      )
   }

   const fetchIcon = (action, type) => {
      switch (action) {
         case 'create':
            if (type === 'folder') {
               return <CreateFolder size="20" />
            } else {
               return <CreateFile size="20" />
            }
         case 'rename':
            return <EditIcon size="20" />
         case 'delete':
            return <DeleteIcon size="20" />
         case 'copy':
            return <CopyIcon size="20" />
         default:
            return null
      }
   }

   const optionHandler = option => {
      if (option.type === 'file' && option.action === 'copy') {
         copyToClipboard()
      } else if (
         option.type === 'folder' ||
         (option.type === 'file' && option.action !== 'create')
      ) {
         setContextMenuInfo({
            ...option,
            contextPath: node.path,
            showPopup: {
               formTypePopup: true,
            },
         })
         // setPopupInfo({
         //    createTypePopup: false,
         //    fileTypePopup: false,
         //    formTypePopup: true,
         // })
      } else if (option.type === 'file') {
         setContextMenuInfo({
            ...option,
            contextPath: node.path,
            showPopup: {
               fileTypePopup: true,
            },
         })
      }
   }
   // const {
   //    createFile,
   //    createFolder,
   //    renameFile,
   //    renameFolder,
   //    deleteFile,
   //    deleteFolder,
   //    recordFile,
   //    updateRecoredFile,
   //    deleteRecoredFile,
   // } = useDailyGit()
   // const mutationHandler = (type, nodeType) => {
   //    if (type === 'Create') {
   //       if (nodeType === 'FILE') {
   //          const filePath = `${path.replace(
   //             process.env.REACT_APP_ROOT_FOLDER,
   //             ''
   //          )}/${name}.${fileType.current}`
   //          createFile({
   //             variables: {
   //                path: filePath,
   //                content: `Start writing content of file here...`,
   //             },
   //          })
   //          recordFile({
   //             variables: {
   //                object: {
   //                   fileType: fileType.current,
   //                   fileName: `${name}.${fileType.current}`,
   //                   path: filePath,
   //                   lastSaved: now,
   //                },
   //             },
   //          })
   //          fileType.current = ''
   //       } else {
   //          const folderPath = `${path.replace(
   //             process.env.REACT_APP_ROOT_FOLDER,
   //             ''
   //          )}/${name}`
   //          createFolder({
   //             variables: {
   //                path: folderPath,
   //             },
   //          })
   //       }
   //    } else if (type === 'Rename') {
   //       if (nodeType === 'FILE') {
   //          const oldFilePath = node.path.replace(/.\/templates/g, '')
   //          const newFilePath = `${oldFilePath.replace(
   //             /\/([^/]*)$/g,
   //             ''
   //          )}/${name}.${oldFilePath.split('.').pop()}`
   //          renameFile({
   //             variables: {
   //                oldPath: oldFilePath,
   //                newPath: newFilePath,
   //             },
   //          })
   //          updateRecoredFile({
   //             variables: {
   //                path: oldFilePath,
   //                set: {
   //                   fileName: `${name}.${oldFilePath.split('.').pop()}`,
   //                   path: newFilePath,
   //                   lastSaved: now,
   //                },
   //             },
   //          })
   //       } else {
   //          const oldFolderPath = node.path.replace(/.\/templates/g, '')
   //          const newFolderPath = `${oldFolderPath.replace(
   //             /\/([^/]*)$/g,
   //             ''
   //          )}/${name}`
   //          renameFolder({
   //             variables: {
   //                oldPath: oldFolderPath,
   //                newPath: newFolderPath,
   //             },
   //          })
   //       }
   //    } else {
   //       if (nodeType === 'FILE') {
   //          const filePath = node.path.replace(/.\/templates/g, '')
   //          deleteFile({
   //             variables: {
   //                path: filePath,
   //             },
   //          })
   //          deleteRecoredFile({
   //             variables: {
   //                path: filePath,
   //             },
   //          })
   //       } else {
   //          const folderPath = node.path.replace(/.\/templates/g, '')
   //          deleteFolder({
   //             variables: {
   //                path: folderPath,
   //             },
   //          })
   //       }
   //    }
   //    actionRef.current = 'Create'
   //    setShowPopup2(!showPopup2)
   //    setName('')
   // }

   return (
      <>
         <Menu style={style}>
            <MenuOptions>
               {node.type === 'folder' ? (
                  <>
                     {options.map(option => {
                        if (
                           option.type === 'folder' ||
                           option.action === 'create'
                        ) {
                           return (
                              <MenuOption
                                 key={option.id}
                                 onClick={() => optionHandler(option)}
                              >
                                 {fetchIcon(option.action, option.type)}
                                 <Spacer xAxis size="4px" />
                                 {option.value}
                              </MenuOption>
                           )
                        }
                     })}
                     {/* <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'create',
                              nodeType: 'file',
                           })
                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: true,
                              formTypePopup: false,
                           })
                        }}
                     >
                        <CreateFile size="20" />
                        <Spacer xAxis size="4px" />
                        New File
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'create',
                              nodeType: 'folder',
                           })

                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: false,
                              formTypePopup: true,
                           })
                        }}
                     >
                        <CreateFolder size="20" />
                        <Spacer xAxis size="10px" />
                        New Folder
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'rename',
                              nodeType: 'folder',
                           })
                           actionRef.current = 'Rename'
                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: false,
                              formTypePopup: true,
                           })
                        }}
                     >
                        <EditIcon size="20" />
                        <Spacer xAxis size="10px" />
                        Rename Folder
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'delete',
                              nodeType: 'folder',
                           })
                           actionRef.current = 'Delete'
                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: false,
                              formTypePopup: true,
                           })
                        }}
                     >
                        <DeleteIcon size="20" />
                        <Spacer xAxis size="10px" />
                        Delete Folder
                     </MenuOption> */}
                  </>
               ) : (
                  <>
                     {options.map(option => {
                        if (
                           (option.type === 'file' &&
                              option.action !== 'create') ||
                           option.action === 'copy'
                        ) {
                           return (
                              <MenuOption
                                 key={option.id}
                                 onClick={() => optionHandler(option)}
                              >
                                 {fetchIcon(option.action, option.type)}
                                 <Spacer xAxis size="4px" />
                                 {option.value}
                              </MenuOption>
                           )
                        }
                     })}
                     {/* <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'rename',
                              nodeType: 'file',
                           })
                           actionRef.current = 'Rename'
                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: false,
                              formTypePopup: true,
                           })
                        }}
                     >
                        <EditIcon size="20" />
                        <Spacer xAxis size="10px" />
                        Rename File
                     </MenuOption>
                     <MenuOption
                        onClick={() => {
                           setContextMenuInfo({
                              action: 'delete',
                              nodeType: 'file',
                           })
                           actionRef.current = 'Delete'
                           setPopupInfo({
                              createTypePopup: false,
                              fileTypePopup: false,
                              formTypePopup: true,
                           })
                        }}
                     >
                        <DeleteIcon size="20" />
                        <Spacer xAxis size="10px" /> Delete File
                     </MenuOption>
                     <MenuOption onClick={copyToClipboard}>
                        Copy File Path
                     </MenuOption> */}
                  </>
               )}
            </MenuOptions>
         </Menu>

         {/* <FileType
            showPopup={showPopup1}
            setShowPopup={() => setShowPopup1(!showPopup1)}
            selectFileType={type => selectFileType(type)}
         />
         <FormType
            showPopup={showPopup2}
            cancelPopup={cancelPopup}
            action={actionRef.current}
            treeViewData={treeViewData}
            nodePath={node?.path}
            nodeType={   name={name}
            setName={name => setName(name)}
            setPath={path => setPath(path)}
            stopDot={e => stopDot(e)}
            mutationHandler={(action, type) => mutationHandler(action, type)}
         /> */}
      </>
   )
}

export default ContextMenu
