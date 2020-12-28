import React from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'

// State
import { Context } from '../../state'

// Components
import TreeView from '../TreeView'
import ContextMenu from '../ContextMenu'

// Styles
import { FileExplorerWrapper } from './styles'

// Queries
import { GET_EXPLORER_CONTENT, GET_FILE } from '../../graphql'
import { toast } from 'react-toastify'

// Helpers
import toggleNode from '../../utils/toggleNode'

const FileExplorer = () => {
   const { state, dispatch } = React.useContext(Context)
   const fileRef = React.useRef({})
   const [data, setData] = React.useState([])
   const nodeRef = React.useRef('')
   const [style, setStyle] = React.useState({
      top: '',
      left: '',
      display: '',
   })
   const [menuVisible, setMenuVisible] = React.useState(false)
   const {
      loading: queryLoading,
      error: queryError,
      data: queryData,
   } = useQuery(GET_EXPLORER_CONTENT, {
      variables: { path: '' },
   })

   const [getFileQuery, { loading: fileLoading }] = useLazyQuery(GET_FILE, {
      onError: error => {
         toast.error('Something went wrong file!')
         console.log(error)
      },
      onCompleted: data => {
         if (
            data &&
            data.constructor === Object &&
            Object.keys(data).length !== 0 &&
            data.editor_file.length > 0 &&
            Object.keys(fileRef.current).length !== 0
         ) {
            dispatch({
               type: 'ADD_TAB',
               payload: {
                  name: fileRef.current.name,
                  path: fileRef.current.path.replace(
                     process.env.REACT_APP_ROOT_FOLDER,
                     ''
                  ),
                  id: data.editor_file[0].id,
                  linkedCss: data.editor_file[0].linkedCssFiles,
                  linkedJs: data.editor_file[0].linkedJsFiles,
               },
            })
         }
      },
   })

   React.useEffect(() => {
      const { getFolderWithFiles: files } = queryData || {}
      if (files) {
         setData(files.children)
      }
   }, [queryData])

   const onToggle = node => {
      const mutated = toggleNode(data, node)
      setData(mutated)
   }

   const onSelection = (node, nodeIndex) => {
      if (node.type === 'folder') {
         onToggle(node.path)
         if (data[nodeIndex].isOpen) {
            console.log('here', node)
            dispatch({
               type: 'ADD_ON_TOGGLE_INFO',
               payload: {
                  name: node.name,
                  path: node.path.replace(
                     process.env.REACT_APP_ROOT_FOLDER,
                     ''
                  ),
                  type: node.type,
               },
            })
         } else {
            dispatch({
               type: 'ADD_ON_TOGGLE_INFO',
               payload: {},
            })
         }
      }
      if (node.type === 'file') {
         fileRef.current = node
         getFileQuery({
            variables: {
               path: node.path.replace(process.env.REACT_APP_ROOT_FOLDER, ''),
            },
         })
      }
   }

   const toggleMenu = command => {
      setStyle({ ...style, display: command === 'show' ? 'block' : 'none' })
      setMenuVisible(!menuVisible)
   }

   const clickHandler = () => {
      if (menuVisible) {
         toggleMenu('hide')
      }
   }

   const showContextMenu = (e, node, command) => {
      e.preventDefault()
      nodeRef.current = node
      setStyle({
         ...style,
         top: `${e.pageY - 20}px`,
         left: `${e.pageX}px`,
         display: command === 'show' ? 'block' : 'none',
      })
      setMenuVisible(!menuVisible)
   }

   if (queryLoading || fileLoading) {
      return <Loader />
   }
   if (queryError) {
      return <div>Error</div>
   }
   return (
      <FileExplorerWrapper
         isSidebarVisible={state.isSidebarVisible}
         onClick={clickHandler}
      >
         <TreeView
            data={data}
            onSelection={onSelection}
            onToggle={onToggle}
            showContextMenu={(e, node) => showContextMenu(e, node, 'show')}
         />
         <ContextMenu style={style} node={nodeRef.current} />
      </FileExplorerWrapper>
   )
}

export default FileExplorer
