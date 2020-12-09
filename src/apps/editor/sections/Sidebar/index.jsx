import React from 'react'

// State
import { Context } from '../../state'
import { Flex } from '@dailykit/ui'
// Components
import { FileExplorer } from '../../components'

// Styles
import { SidebarWrapper, SidebarActions, Header } from './styles'

import { toast } from 'react-toastify'
import { FormType, FileType } from '../../components/Popup'

// Assets
import { ExpandIcon, CollapseIcon, Folder, File } from '../../assets/Icons'
import { useDailyGit } from '../../state/mutationFunction'

const Sidebar = () => {
   const { createFile, createFolder } = useDailyGit()
   const { state, dispatch } = React.useContext(Context)
   const [showPopup1, setShowPopup1] = React.useState(false)
   const [showPopup2, setShowPopup2] = React.useState(false)
   const [type, setType] = React.useState('')
   const [name, setName] = React.useState('')
   const fileType = React.useRef('js')

   const createClick = createType => {
      if (
         state.tabs.length ||
         Object.entries(state.onToggleInfo).length ||
         createType === 'Folder'
      ) {
         createType === 'Folder'
            ? setShowPopup2(!showPopup2)
            : setShowPopup1(!showPopup1)
      } else {
         toast.error('No folder selected!')
      }
      setType(createType)
   }

   const createFolderHandler = () => {
      setShowPopup2(!showPopup2)
      if (state.tabs.length || Object.entries(state.onToggleInfo).length) {
         const filePath = state.onToggleInfo.path
         createFolder({
            variables: {
               path: `${filePath}/${name}`,
            },
         })
      } else {
         console.log('outside')
         createFolder({
            variables: {
               path: `/${name}`,
            },
         })
      }
      setName('')
      setType('')
   }
   const createFileHandler = () => {
      setShowPopup2(!showPopup2)
      if (state.tabs.length || state.onToggleInfo) {
         const filePath = `${state.onToggleInfo.path}/${name}.${fileType.current}`
         createFile({
            variables: {
               path: `${filePath}/${name}`,
               content: `Start writing content of file here... `,
            },
         })
      } else {
         toast.error('No folder selected!')
      }
      setName('')
      setType('')
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
      <SidebarWrapper>
         <Header>
            <SidebarActions>
               {state.isSidebarVisible ? (
                  <Flex
                     container
                     alignItems="center"
                     justifyContent="space-around"
                  >
                     <span
                        className="sideBarArrow"
                        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                     >
                        <ExpandIcon color="#9a8484" />
                     </span>
                     <span
                        className="sideBarIcon"
                        onClick={() => createClick('Folder')}
                     >
                        <Folder size="20px" color="#120136" />
                     </span>
                     <span
                        className="sideBarIcon"
                        onClick={() => createClick('File')}
                     >
                        <File size="20px" color="#120136" />
                     </span>
                  </Flex>
               ) : (
                  <span
                     className="sideBarArrow"
                     onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                  >
                     <CollapseIcon color="#9a8484" />
                  </span>
               )}
            </SidebarActions>
         </Header>
         <FileExplorer />
         <FileType
            showPopup={showPopup1}
            setShowPopup={() => setShowPopup1(!showPopup1)}
            selectFileType={type => selectFileType(type)}
         />
         <FormType
            showPopup={showPopup2}
            action="Create"
            nodeType={type}
            name={name}
            setName={name => setName(name)}
            stopDot={e => stopDot(e)}
            cancelPopup={() => setShowPopup2(!showPopup2)}
            mutationHandler={(action, type) =>
               type === 'FOLDER' ? createFolderHandler() : createFileHandler()
            }
         />
      </SidebarWrapper>
   )
}

export default Sidebar
