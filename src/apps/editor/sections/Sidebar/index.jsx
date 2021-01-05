import React from 'react'

// State
import { Context } from '../../state'
import { Flex } from '@dailykit/ui'
// Components
import { FileExplorer } from '../../components'
import moment from 'moment'

// Styles
import { SidebarWrapper, SidebarActions, Header } from './styles'
import { useQuery } from '@apollo/react-hooks'
import { GET_NESTED_FOLDER } from '../../graphql'
import { toast } from 'react-toastify'
import { FormType, FileType } from '../../components/Popup'

// Assets
import { ExpandIcon, CollapseIcon, Folder, File } from '../../assets/Icons'
import { useDailyGit } from '../../state/mutationFunction'

const Sidebar = () => {
   const now = moment().toISOString()
   const { createFile, createFolder, recordFile } = useDailyGit()
   const { state, dispatch } = React.useContext(Context)
   const [showPopup1, setShowPopup1] = React.useState(false)
   const [showPopup2, setShowPopup2] = React.useState(false)
   const [type, setType] = React.useState('')
   const [node, setNode] = React.useState({})
   const [name, setName] = React.useState('')
   const [path, setPath] = React.useState('')
   const fileType = React.useRef('js')

   const {
      loading: queryLoading2,
      error: queryError2,
      data: { getNestedFolders: { children: nestedFolders = [] } = {} } = {},
   } = useQuery(GET_NESTED_FOLDER, {
      variables: { path: '' },
   })

   const createClick = createType => {
      if (createType === 'Folder') {
         setShowPopup2(!showPopup2)
      } else {
         setShowPopup1(!showPopup1)
      }
      setType(createType)
      setNode(state.onToggleInfo)
   }

   const createFolderHandler = () => {
      setShowPopup2(!showPopup2)
      const folderPath = `${path.replace(
         process.env.REACT_APP_ROOT_FOLDER,
         ''
      )}/${name}`
      createFolder({
         variables: {
            path: folderPath,
         },
      })
      setName('')
      setType('')
      setNode({})
   }
   const createFileHandler = () => {
      setShowPopup2(!showPopup2)
      const filePath = `${path.replace(
         process.env.REACT_APP_ROOT_FOLDER,
         ''
      )}/${name}.${fileType.current}`
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
               fileType: fileType.current,
               fileName: `${name}.${fileType.current}`,
               path: filePath,
               lastSaved: now,
            },
         },
      })

      setName('')
      setType('')
      setNode({})
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
            treeViewData={nestedFolders}
            nodePath={node?.path?.replace('/', '')}
            nodeType={type}
            name={name}
            setName={name => setName(name)}
            setPath={path => setPath(path)}
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
