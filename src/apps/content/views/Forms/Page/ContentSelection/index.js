import React, { useState, useRef, useContext } from 'react'
import {
   Flex,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   ComboButton,
   IconButton,
   PlusIcon,
   Text,
   Filler,
   useTunnel,
} from '@dailykit/ui'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DeleteIcon, EditIcon } from '../../../../../../shared/assets/icons'
import { DragNDrop, InlineLoader } from '../../../../../../shared/components'
import { useDnd } from '../../../../../../shared/components/DragNDrop/useDnd'
import { StyledWrapper, WrapDiv, Child } from './styled'
import {
   LINKED_COMPONENT,
   LINK_COMPONENT,
   DELETE_LINKED_COMPONENT,
} from '../../../../graphql'
import { logger } from '../../../../../../shared/utils'
import { ConfigTunnel } from '../Tunnel'
import File from './File'
import Template from './Template'
import ConfigContext from '../../../../context/Config'

const ContentSelection = () => {
   const [configTunnels, openConfigTunnel, closeConfigTunnel] = useTunnel()
   const { initiatePriority } = useDnd()
   const { pageId, pageName } = useParams()
   const [linkedFiles, setLinkedFiles] = useState([])
   const [selectedFileOptions, setSelectedFileOptions] = useState([])
   const [configContext, setConfigContext] = useContext(ConfigContext)
   // const oldConfig = useRef({})
   // Subscription
   const { loading, error } = useSubscription(LINKED_COMPONENT, {
      variables: {
         pageId,
      },
      onSubscriptionData: ({
         subscriptionData: {
            data: { website_websitePageModule: pageModules = [] } = {},
         } = {},
      }) => {
         const files = pageModules.filter(page => page.moduleType === 'file')
         const templates = pageModules.filter(
            page => page.moduleType === 'template'
         )
         setLinkedFiles(files)
         if (files.length) {
            initiatePriority({
               tablename: 'websitePageModule',
               schemaname: 'website',
               data: files,
            })
         }
      },
   })

   // Mutation
   const [linkComponent] = useMutation(LINK_COMPONENT, {
      onCompleted: () => {
         toast.success(`Added to the "${pageName}" page successfully!!`)
         setSelectedFileOptions([])
         closeConfigTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
         setSelectedFileOptions([])
      },
   })
   // Mutation
   const [deleteLinkComponent] = useMutation(DELETE_LINKED_COMPONENT, {
      onCompleted: () => {
         toast.success(`Linked component successfully deleted!`)
         setSelectedFileOptions([])
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
         setSelectedFileOptions([])
      },
   })

   // const updatetoggle = () => {
   //    const val = !toggle
   //    // if (val && !state.isCouponValid.status) {
   //    //    toast.error('Coupon should be valid!')
   //    // } else {
   //    updatePage({
   //       variables: {
   //          pageId: pageId,
   //          set: {
   //             published: val,
   //          },
   //       },
   //    })
   //    // }
   // }

   const saveHandler = dataConfig => {
      console.log(dataConfig)
      if (selectedFileOptions.length) {
         const result = selectedFileOptions.map(option => {
            return {
               websitePageId: +pageId,
               moduleType: 'file',
               fileId: option.id,
               config: dataConfig,
            }
         })

         linkComponent({
            variables: {
               objects: result,
            },
         })
      }
   }

   const deleteHandler = fileId => {
      deleteLinkComponent({
         variables: {
            where: {
               websitePageId: { _eq: pageId },
               fileId: { _eq: fileId },
            },
         },
      })
   }
   const openConfig = data => {
      setConfigContext(data)
      openConfigTunnel(1)
   }

   if (loading) {
      return <InlineLoader />
   }
   if (error) {
      toast.error('Something went wrong')
      logger(error)
   }
   return (
      <Flex container justifyContent="space-between">
         <WrapDiv>
            <Text as="title">Linked Components </Text>
            {linkedFiles.length ? (
               <DragNDrop
                  list={linkedFiles}
                  droppableId="linkFileDroppableId"
                  tablename="websitePageModule"
                  schemaname="website"
               >
                  {linkedFiles.map(file => {
                     return (
                        <Child>
                           {/* <ButtonTile
                           noIcon
                           size="sm"
                           type="secondary"
                           text={file?.file?.fileName || ''}
                        /> */}

                           <div className="name">
                              {file?.file?.fileName || ''}
                           </div>
                           {file.config && (
                              <IconButton
                                 type="ghost"
                                 onClick={() => openConfig(file?.config)}
                              >
                                 <EditIcon color="#555b6e" size="20" />
                              </IconButton>
                           )}
                           <IconButton
                              type="ghost"
                              onClick={() => deleteHandler(file.fileId)}
                           >
                              <DeleteIcon color="#555b6e" size="20" />
                           </IconButton>
                        </Child>
                     )
                  })}
               </DragNDrop>
            ) : (
               <Filler
                  message="No component linked yet!"
                  width="80%"
                  height="80%"
               />
            )}
         </WrapDiv>
         <StyledWrapper>
            <Flex container justifyContent="flex-end">
               <ComboButton
                  type="solid"
                  size="md"
                  onClick={() => openConfigTunnel(1)}
               >
                  <PlusIcon color="#fff" /> Add
               </ComboButton>
            </Flex>
            <HorizontalTabs>
               {/* <div className="styleTab"> */}
               <HorizontalTabList>
                  <HorizontalTab>Add Files</HorizontalTab>
                  <HorizontalTab>Add Templates</HorizontalTab>
                  <HorizontalTab>Add Modules</HorizontalTab>
               </HorizontalTabList>
               {/* </div> */}
               <HorizontalTabPanels>
                  {/* <div className="styleTab"> */}
                  <HorizontalTabPanel>
                     <File
                        linkedFiles={linkedFiles}
                        selectedOption={option =>
                           setSelectedFileOptions(option)
                        }
                        emptyOptions={selectedFileOptions}
                     />
                  </HorizontalTabPanel>
                  {/* </div> */}
                  <HorizontalTabPanel>
                     <Template linkedTemplated={[]} />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>Internal Module</HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>

            <ConfigTunnel
               tunnels={configTunnels}
               openTunnel={openConfigTunnel}
               closeTunnel={closeConfigTunnel}
               onSave={dataConfig => saveHandler(dataConfig)}
               selectedOption={selectedFileOptions}
            />
         </StyledWrapper>
      </Flex>
   )
}

export default ContentSelection
