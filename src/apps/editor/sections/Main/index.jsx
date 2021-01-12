import React from 'react'
import { TabPanels } from '@reach/tabs'
import { Switch, Route } from 'react-router-dom'
import moment from 'moment'
// State
import { Context } from '../../state'
import { useGlobalContext, useTabs, useDailyGit } from '../../context'
import { FormType, FileType, CreateType } from '../../components/Popup'
import { useQuery } from '@apollo/react-hooks'
import { GET_NESTED_FOLDER } from '../../graphql'
import { Home, Editor } from '../../views'
// Components

// Styles
import {
   MainWrapper,
   TabsNav,
   TabOptions,
   StyledTabs,
   StyledTabList,
   StyledTab,
   StyledTabPanel,
} from './styles'

// Assets
import {
   CloseIcon,
   CaretLeftIcon,
   CaretRightIcon,
   CaretDownIcon,
   CaretUpIcon,
} from '../../assets/Icons'

const Main = () => {
   const { globalState, setPopupInfo, setContextMenuInfo } = useGlobalContext()
   const mainWidth = () => {
      let width = '100vw'
      if (globalState.isSidebarVisible && globalState.isSidePanelVisible) {
         width = `calc(${width} - 520px)`
      } else if (
         globalState.isSidebarVisible &&
         !globalState.isSidePanelVisible
      ) {
         width = `calc(${width} - 280px)`
      } else if (
         !globalState.isSidebarVisible &&
         globalState.isSidePanelVisible
      ) {
         width = `calc(${width} - 280px)`
      } else {
         width = `calc(${width} - 40px)`
      }
      return width
   }

   const now = moment().toISOString()
   const { tab, tabs } = useTabs()
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
   const [type, setType] = React.useState('')
   const [node, setNode] = React.useState({})
   const [name, setName] = React.useState('')
   const [path, setPath] = React.useState('')
   const fileTypeRef = React.useRef('')

   const {
      loading: queryLoading2,
      error: queryError2,
      data: { getNestedFolders: { children: nestedFolders = [] } = {} } = {},
   } = useQuery(GET_NESTED_FOLDER, {
      variables: { path: '' },
   })

   const closePopup = () => {
      setPopupInfo({
         createTypePopup: false,
         fileTypePopup: false,
         formTypePopup: false,
      })
   }

   const setCreateType = createType => {
      const option = {
         type: createType,
         action: 'create',
         contextPath: './templates',
      }

      if (createType === 'folder') {
         setContextMenuInfo({
            ...option,
            contextPath: './templates',
            showPopup: {
               createTypePopup: false,
               fileTypePopup: false,
               formTypePopup: true,
            },
         })
      } else {
         setContextMenuInfo({
            ...option,
            contextPath: './templates',
            showPopup: {
               createTypePopup: false,
               fileTypePopup: true,
               formTypePopup: false,
            },
         })
      }
      setType(createType)
      setNode(globalState.onToggleInfo)
   }

   // const createFolderHandler = () => {
   //    closePopup()
   //    const folderPath = `${path.replace(
   //       process.env.REACT_APP_ROOT_FOLDER,
   //       ''
   //    )}/${name}`
   //    createFolder({
   //       variables: {
   //          path: folderPath,
   //       },
   //    })
   //    setName('')
   //    setType('')
   //    setNode({})
   // }
   // const createFileHandler = () => {
   //    closePopup()
   //    const filePath = `${path.replace(
   //       process.env.REACT_APP_ROOT_FOLDER,
   //       ''
   //    )}/${name}.${fileTypeRef.current}`
   //    console.log(filePath)
   //    createFile({
   //       variables: {
   //          path: filePath,
   //          content: `Start writing content of file here...`,
   //       },
   //    })
   //    recordFile({
   //       variables: {
   //          object: {
   //             fileTypeRef: fileTypeRef.current,
   //             fileName: `${name}.${fileTypeRef.current}`,
   //             path: filePath,
   //             lastSaved: now,
   //          },
   //       },
   //    })

   //    setName('')
   //    setType('')
   //    setNode({})
   // }

   const selectFileType = type => {
      fileTypeRef.current = type
      setPopupInfo({
         createTypePopup: false,
         fileTypePopup: false,
         formTypePopup: true,
      })
   }

   const mutationHandler = (type, nodeType) => {
      if (type === 'create') {
         if (nodeType === 'FILE') {
            const filePath = `${path.replace(
               process.env.REACT_APP_ROOT_FOLDER,
               ''
            )}/${name}.${fileTypeRef.current}`
            console.log(filePath)
            createFile({
               variables: {
                  path: filePath,
                  content: `Start writing content of file here...`,
               },
            })
            recordFile({
               variables: {
                  object: {
                     fileType: fileTypeRef.current,
                     fileName: `${name}.${fileTypeRef.current}`,
                     path: filePath,
                     lastSaved: now,
                  },
               },
            })
            fileTypeRef.current = ''
         } else {
            const folderPath = `${path.replace(
               process.env.REACT_APP_ROOT_FOLDER,
               ''
            )}/${name}`
            console.log(path, folderPath)
            createFolder({
               variables: {
                  path: folderPath,
               },
            })
         }
      } else if (type === 'rename') {
         if (nodeType === 'FILE') {
            const oldFilePath = path.replace(/.\/templates/g, '')
            const newFilePath = `${oldFilePath.replace(
               /\/([^/]*)$/g,
               ''
            )}/${name}.${oldFilePath.split('.').pop()}`
            console.log(oldFilePath, ',', newFilePath)
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
            const oldFolderPath = path.replace(/.\/templates/g, '')
            const newFolderPath = `${oldFolderPath.replace(
               /\/([^/]*)$/g,
               ''
            )}/${name}`
            console.log(oldFolderPath, ',', newFolderPath)
            renameFolder({
               variables: {
                  oldPath: oldFolderPath,
                  newPath: newFolderPath,
               },
            })
         }
      } else {
         if (nodeType === 'FILE') {
            const filePath = path.replace(/.\/templates/g, '')
            console.log(filePath)
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
            const folderPath = path.replace(/.\/templates/g, '')
            console.log(folderPath)
            deleteFolder({
               variables: {
                  path: folderPath,
               },
            })
         }
      }
      setName('')
      closePopup()
   }

   return (
      <MainWrapper width={mainWidth()}>
         <main>
            <Switch>
               <Route path="/editor" component={Home} exact />
               <Route path="/editor/:path+" component={Editor} exact />
            </Switch>

            <FileType
               show={globalState.popupInfo.fileTypePopup}
               closePopup={closePopup}
               setFileType={type => selectFileType(type)}
            />
            <FormType
               show={globalState.popupInfo.formTypePopup}
               closePopup={closePopup}
               action={globalState.contextMenuInfo.action}
               treeViewData={nestedFolders}
               nodePath={
                  globalState?.contextMenuInfo?.contextPath || './templates'
               }
               nodeType={globalState.contextMenuInfo.type}
               name={name}
               setName={name => setName(name)}
               setPath={path => setPath(path)}
               mutationHandler={(action, type) => mutationHandler(action, type)}
            />
            <CreateType
               show={globalState.popupInfo.createTypePopup}
               closePopup={closePopup}
               setCreateType={type => setCreateType(type)}
            />
         </main>
      </MainWrapper>
   )
}

export default Main
