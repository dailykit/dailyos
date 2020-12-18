import React from 'react'
import {
   Loader,
   Text,
   ComboButton,
   PlusIcon,
   useTunnel,
   Filler,
} from '@dailykit/ui'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { FILE_LINKS, REMOVE_CSS_LINK, REMOVE_JS_LINK } from '../../graphql'
import {
   ChevronUp,
   ChevronDown,
   DeleteIcon,
} from '../../../../shared/assets/icons'
import { Context } from '../../state'
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
import { toast } from 'react-toastify'

const Panel = () => {
   const { state, dispatch } = React.useContext(Context)
   const [cssTunnels, openCssTunnel, closeCssTunnel] = useTunnel(1)
   const [jsTunnels, openJsTunnel, closeJsTunnel] = useTunnel(1)
   const [selectedCssFiles, setSelectedCssFiles] = React.useState([])
   const [selectedJsFiles, setSelectedJsFiles] = React.useState([])
   const [node, setNode] = React.useState({
      linkCss: {
         isOpen: false,
      },
      linkJs: {
         isOpen: false,
      },
   })

   //query to load all files in dropdown

   const { loading: linkLoading } = useSubscription(FILE_LINKS, {
      variables: {
         path: state?.tabs[state?.currentTab]?.path,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { editor_file = [] } = {} } = {},
      }) => {
         const cssLinks = editor_file[0].linkedCssFiles
         const jsLinks = editor_file[0].linkedJsFiles
         const cssResult = cssLinks.map(file => {
            return {
               id: file.cssFile.id,
               title: file.cssFile.fileName,
               value: file.cssFile.path,
               type: file.cssFile.fileType,
            }
         })
         const jsResult = jsLinks.map(file => {
            return {
               id: file.jsFile.id,
               title: file.jsFile.fileName,
               value: file.jsFile.path,
               type: file.jsFile.fileType,
            }
         })
         setSelectedCssFiles([...cssResult])
         setSelectedJsFiles([...jsResult])
         dispatch({
            type: 'UPDATE_LINKED_FILE',
            payload: {
               path: state?.tabs[state?.currentTab]?.path,
               linkedCss: cssLinks,
               linkedJs: jsLinks,
            },
         })
      },
      skip: !state && !state?.tabs?.length,
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
      refetchQueries: ['FILE_LINKS'],
   })

   const cssSelectedOption = option => {
      console.log(option)
      setSelectedCssFiles(option)
   }
   const jsSelectedOption = option => {
      setSelectedJsFiles(option)
   }

   const unlinkCss = (guiFileId, cssFileId) => {
      removeLinkCss({
         variables: {
            guiFileId,
            cssFileId,
         },
      })
      // console.log(guiFileId, cssFileId)
   }

   if (linkLoading) return <Loader />
   return (
      <PanelWrapper isSidePanelVisible={state.isSidePanelVisible}>
         {state?.tabs[state?.currentTab]?.path.split('.').pop() === 'html' ? (
            <Parent>
               <Node
                  isOpen={node.linkCss.isOpen}
                  onClick={() =>
                     setNode({
                        ...node,
                        linkCss: {
                           ...state.linkCss,
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
                              ...state.linkCss,
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
                        {selectedCssFiles.map(file => {
                           return (
                              <Child key={file.id}>
                                 <span>{file.title}</span>
                                 <span
                                    className="delete"
                                    onClick={() =>
                                       unlinkCss(
                                          state?.tabs[state?.currentTab]?.id,
                                          file.id
                                       )
                                    }
                                 >
                                    <DeleteIcon color="black" />
                                 </span>
                              </Child>
                           )
                        })}
                     </Children>
                  </Fold>
               )}

               <Node
                  isOpen={node.linkJs.isOpen}
                  onClick={() =>
                     setNode({
                        ...node,
                        linkJs: {
                           ...state.linkJs,
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
                              ...state.linkJs,
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
                        {selectedJsFiles.map(file => {
                           return (
                              <Child key={file.id}>
                                 <span>{file.title}</span>
                                 <span className="delete">
                                    <DeleteIcon color="black" />
                                 </span>
                              </Child>
                           )
                        })}
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
