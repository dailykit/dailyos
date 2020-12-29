import React, { useState, useEffect } from 'react'
import {
   Flex,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   Form,
   Spacer,
   ComboButton,
   IconButton,
   PlusIcon,
   Text,
   ButtonTile,
} from '@dailykit/ui'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTabs } from '../../../../context'
import { DeleteIcon } from '../../../../../../shared/assets/icons'
import { DragNDrop } from '../../../../../../shared/components'
import { useDnd } from '../../../../../../shared/components/DragNDrop/useDnd'
import {
   StyledWrapper,
   StyledComp,
   InputWrapper,
   StyledDiv,
   StyledInsight,
   Highlight,
   WrapDiv,
   Child,
} from './styled'
import {
   GET_FILES,
   GET_TEMPLATES,
   UPDATE_WEBPAGE,
   LINKED_COMPONENT,
   LINK_COMPONENT,
   DELETE_LINKED_COMPONENT,
} from '../../../../graphql'
import { logger } from '../../../../../../shared/utils'
import File from './File'
import {
   Tooltip,
   InlineLoader,
   InsightDashboard,
} from '../../../../../../shared/components'
import moment from 'moment'
import Template from './Template'
// import { CloseIcon, TickIcon } from '../../../../../../shared/assets/icons'

const ContentSelection = () => {
   const { initiatePriority } = useDnd()
   const { pageId, pageName } = useParams()
   const [linkedFiles, setLinkedFiles] = useState([])
   const [selectedFileOptions, setSelectedFileOptions] = useState([])
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

   const saveHandler = () => {
      if (selectedFileOptions.length) {
         const result = selectedFileOptions.map(option => {
            return {
               websitePageId: +pageId,
               moduleType: 'file',
               fileId: option.id,
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
            <Text as="title">Change Position </Text>
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

                        <div className="name">{file?.file?.fileName || ''}</div>
                        <IconButton
                           type="ghost"
                           onClick={() => deleteHandler(file.fileId)}
                        >
                           <DeleteIcon color="#FF5A52" size="20" />
                        </IconButton>
                     </Child>
                  )
               })}
            </DragNDrop>
         </WrapDiv>
         <StyledWrapper>
            <Flex container justifyContent="flex-end">
               <ComboButton type="solid" size="md" onClick={saveHandler}>
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
         </StyledWrapper>
      </Flex>
   )
}

export default ContentSelection
