import React from 'react'
import {
   Loader,
   Text,
   ComboButton,
   PlusIcon,
   useTunnel,
   Filler,
} from '@dailykit/ui'
import {
   useQuery,
   useMutation,
   useSubscription,
   useLazyQuery,
} from '@apollo/react-hooks'
import {
   FILE_LINKS,
   REMOVE_CSS_LINK,
   REMOVE_JS_LINK,
   UPDATE_LINK_CSS_FILES,
   PRIORITY_UPDATE,
} from '../../graphql'
import {
   ChevronUp,
   ChevronDown,
   DeleteIcon,
} from '../../../../shared/assets/icons'
// import { Context } from '../../state'
import { useTabs, useGlobalContext } from '../../context'
import {
   PanelWrapper,
   Icon,
   Parent,
   Node,
   Children,
   Fold,
   Child,
} from './style'
import { LinkCssTunnel, LinkJsTunnel } from './Tunnel'
import { DragNDrop, InlineLoader } from '../../../../shared/components'
import { useDnd } from '../../../../shared/components/DragNDrop/useDnd'
import { toast } from 'react-toastify'

const Panel = () => {
   console.log('called')
   const { tab, tabs } = useTabs()
   const { updateLinkedFile, globalState } = useGlobalContext()
   const { initiatePriority } = useDnd()
   // const { state, dispatch } = React.useContext(Context)
   const [cssTunnels, openCssTunnel, closeCssTunnel] = useTunnel(1)
   const [jsTunnels, openJsTunnel, closeJsTunnel] = useTunnel(1)
   const [selectedCssFiles, setSelectedCssFiles] = React.useState([])
   const [selectedJsFiles, setSelectedJsFiles] = React.useState([])
   const [node, setNode] = React.useState({
      linkCss: {
         id: 'linkCss',
         isOpen: false,
      },
      linkJs: {
         id: 'linkJs',
         isOpen: false,
      },
   })

   //mutation for initial priority update
   const [initialPriorityUpdate] = useLazyQuery(PRIORITY_UPDATE, {
      onCompleted: () => {
         toast.success('Priority updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         console.log(error)
      },
   })

   //query to load all files in dropdown
   console.log(tab)

   const { loading: linkLoading } = useSubscription(FILE_LINKS, {
      variables: {
         path: tab?.filePath.replace(process.env.REACT_APP_ROOT_FOLDER, ''),
      },
      onSubscriptionData: ({
         subscriptionData: { data: { editor_file = [] } = {} } = {},
      }) => {
         const cssLinks = editor_file[0].linkedCssFiles
         const jsLinks = editor_file[0].linkedJsFiles
         const cssResult = cssLinks.map(file => {
            return {
               id: file.id,
               cssFileId: file.cssFile.cssFileId,
               title: file.cssFile.fileName,
               value: file.cssFile.path,
               type: file.cssFile.fileType,
               position: file.position,
            }
         })
         const jsResult = jsLinks.map(file => {
            return {
               id: file.id,
               jsFileId: file.jsFile.jsFileId,
               title: file.jsFile.fileName,
               value: file.jsFile.path,
               type: file.jsFile.fileType,
               position: file.position,
            }
         })
         if (cssResult.length > 0) {
            initiatePriority({
               tablename: 'cssFileLinks',
               schemaname: 'editor',
               data: cssResult,
            })
         }
         if (jsResult.length > 0) {
            initiatePriority({
               tablename: 'jsFileLinks',
               schemaname: 'editor',
               data: jsResult,
            })
         }

         setSelectedCssFiles([...cssResult])
         setSelectedJsFiles([...jsResult])
         updateLinkedFile({
            path: tab.path,
            linkedCss: cssLinks,
            linkedJs: jsLinks,
         })
      },
      skip: !tab && !tabs?.length,
   })

   //mutation for removing linked css
   const [removeLinkCss] = useMutation(REMOVE_CSS_LINK, {
      onCompleted: () => {
         toast.success('File unlinked successfully!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         console.log(error)
      },
   })

   //mutation for removing linked css
   const [removeLinkJs] = useMutation(REMOVE_JS_LINK, {
      onCompleted: () => {
         toast.success('File unlinked successfully!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         console.log(error)
      },
   })

   const cssSelectedOption = option => {
      setSelectedCssFiles(option)
   }
   const jsSelectedOption = option => {
      setSelectedJsFiles(option)
   }

   const unlinkCss = (guiFileId, id) => {
      removeLinkCss({
         variables: {
            guiFileId,
            id,
         },
      })
   }
   const unlinkJs = (guiFileId, id) => {
      removeLinkJs({
         variables: {
            guiFileId,
            id,
         },
      })
   }

   if (linkLoading) return <InlineLoader />
   return (
      <PanelWrapper>
         {tab?.path.split('.').pop() === 'html' ? (
            <Parent>
               <Node
                  isOpen={node.linkCss.isOpen}
                  onClick={() =>
                     setNode({
                        ...node,
                        linkCss: {
                           ...node.linkCss,
                           isOpen: !node.linkCss.isOpen,
                        },
                     })
                  }
               >
                  <span>Link CSS Files </span>
                  <Icon
                     isOpen={node.linkCss.isOpen}
                     onClick={() =>
                        setNode({
                           ...node,
                           linkCss: {
                              ...node.linkCss,
                              isOpen: !node.linkCss.isOpen,
                           },
                        })
                     }
                  >
                     {node.linkCss.isOpen ? <ChevronUp /> : <ChevronDown />}
                  </Icon>
               </Node>

               {node.linkCss.isOpen && (
                  <Fold>
                     <ComboButton
                        type="outline"
                        size="sm"
                        onClick={() => openCssTunnel(1)}
                     >
                        <PlusIcon />
                        Add more files
                     </ComboButton>
                     <Children>
                        <Text as="subtitle">Linked CSS</Text>
                        <DragNDrop
                           list={selectedCssFiles}
                           droppableId="linkCssDroppableId"
                           tablename="cssFileLinks"
                           schemaname="editor"
                        >
                           {selectedCssFiles.map(file => {
                              return (
                                 <Child key={file.id}>
                                    <span>{file.title}</span>
                                    <span
                                       className="delete"
                                       onClick={() =>
                                          unlinkCss(tab?.id, file.id)
                                       }
                                    >
                                       <DeleteIcon color="black" />
                                    </span>
                                 </Child>
                              )
                           })}
                        </DragNDrop>
                     </Children>
                  </Fold>
               )}

               <Node
                  isOpen={node.linkJs.isOpen}
                  onClick={() =>
                     setNode({
                        ...node,
                        linkJs: {
                           ...node.linkJs,
                           isOpen: !node.linkJs.isOpen,
                        },
                     })
                  }
               >
                  <span>Link JS Files </span>
                  <Icon
                     isOpen={node.linkJs.isOpen}
                     onClick={() =>
                        setNode({
                           ...node,
                           linkJs: {
                              ...node.linkJs,
                              isOpen: !node.linkJs.isOpen,
                           },
                        })
                     }
                  >
                     {node.linkJs.isOpen ? <ChevronUp /> : <ChevronDown />}
                  </Icon>
               </Node>
               {node.linkJs.isOpen && (
                  <Fold>
                     <ComboButton
                        type="outline"
                        size="sm"
                        onClick={() => openJsTunnel(1)}
                     >
                        <PlusIcon />
                        Add more Files
                     </ComboButton>
                     <Children>
                        <Text as="subtitle">Linked JS</Text>
                        <DragNDrop
                           list={selectedJsFiles}
                           droppableId="linkJsDroppableId"
                           tablename="jsFileLinks"
                           schemaname="editor"
                        >
                           {selectedJsFiles.map(file => {
                              return (
                                 <Child key={file.id}>
                                    <span>{file.title}</span>
                                    <span
                                       className="delete"
                                       onClick={() => unlinkJs(tab.id, file.id)}
                                    >
                                       <DeleteIcon color="black" />
                                    </span>
                                 </Child>
                              )
                           })}
                        </DragNDrop>
                     </Children>
                  </Fold>
               )}
            </Parent>
         ) : (
            <Filler
               message="No HTML file is selected"
               width="250px"
               height="250px"
            />
         )}

         <LinkCssTunnel
            tunnels={cssTunnels}
            openTunnel={openCssTunnel}
            closeTunnel={closeCssTunnel}
            linkCssIds={selectedCssFiles}
         />
         <LinkJsTunnel
            tunnels={jsTunnels}
            openTunnel={openJsTunnel}
            closeTunnel={closeJsTunnel}
            linkJsIds={selectedJsFiles}
         />
      </PanelWrapper>
   )
}

export default Panel
