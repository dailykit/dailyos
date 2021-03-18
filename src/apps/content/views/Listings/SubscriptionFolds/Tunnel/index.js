import React, { useState, useContext,useRef } from 'react'
import { useMutation,useSubscription } from '@apollo/react-hooks'
import { TunnelHeader, Loader, Flex, Form, Spacer,Dropdown } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { TunnelBody, StyledWrapper, InputWrapper } from './styled'
import { useTabs } from '../../../../../../shared/providers'
import { INSERT_SUBSCRIPTION_FOLD,GET_FILES } from '../../../../graphql'
import FoldContext from '../../../../context/Fold'

import { Tooltip, InlineLoader } from '../../../../../../shared/components'
import { logger } from '../../../../../../shared/utils'
import { defaultFormat } from 'moment'

export default function LinkFoldTunnel({ close }) {
   const identifierOptions = [
      { id: 1, title: 'select-plan-bottom-01'},
      { id: 2, title: 'select-delivery-bottom-01' },
      { id: 3, title: 'select-menu-bottom-01'},
      { id: 4, title: 'home-bottom-01' },
   ]
   const [foldContext, setFoldContext] = useContext(FoldContext)
   const [files, setFiles] = useState([])
   const [searchQueryForIdentifier,setSearchQueryForIdentifier] = useState("")
   const [searchQueryForFile,setSearchQueryForFile] = useState("")
   const [searchResultForIdentifier,setSearchResultForIdentifier] = useState(identifierOptions)
   const [searchResultForFile,setSearchResultForFile] = useState([])
   const [defaultIdentifierId,setDefaultIdentifierId] = useState(null)
   const [defaultFileId,setDefaultFileId] = useState(null)
   const selectedIdentifierRef = useRef(null)
   const selectedFileIdRef = useRef(null)


   const { loading:subscriptionLoading, error:subscriptionError } = useSubscription(GET_FILES, {
      variables: {
         linkedFile: [],
         fileTypes: ['html', 'liquid', 'pug', 'mustache', 'ejs'],
      },
      onSubscriptionData: ({
         subscriptionData: {
            data: { editor_file_aggregate: { nodes = [] } } = {},
         } = {},
      }) => {
         const result = nodes.map(file => {
            return {
               id: file.id,
               title: file.fileName,
               value: file.path,
               type: file.fileType,
            }
         })
         setFiles(result)
         setSearchResultForFile(result)
         console.log("completed...",result)
      },
   })

   // const [pageTitle, setPageTitle] = useState({
   //    value: '',
   //    meta: {
   //       isValid: false,
   //       isTouched: false,
   //       errors: [],
   //    },
   // })
   // const [pageRoute, setPageRoute] = useState({
   //    value: '',
   //    meta: {
   //       isValid: false,
   //       isTouched: false,
   //       errors: [],
   //    },
   // })




   const selectedOptionforIdentifier = option => {
      selectedIdentifierRef.current = option.title
   }
   const selectedOptionforFile = option => {
      selectedFileIdRef.current = option.id
   }

   // // form validation
   // const validatePageName = (value, name) => {
   //    const text = value.trim()
   //    let isValid = true
   //    let errors = []
   //    if (name === 'pageTitle') {
   //       if (text.length < 2) {
   //          isValid = false
   //          errors = [...errors, 'Must have atleast two letters.']
   //       }
   //    } else {
   //       if (text.length < 1) {
   //          isValid = false
   //          errors = [...errors, 'Must have atleast one letters.']
   //       }
   //       if (!text.includes('/') && text.length > 0) {
   //          isValid = false
   //          errors = [...errors, "Invalid route..Must start with ' / '."]
   //       }
   //    }
   //    return { isValid, errors }
   // }

   // Mutation
   const [linkFold, { loading:mutationLoading }] = useMutation(INSERT_SUBSCRIPTION_FOLD, {
      onCompleted: () => {
        selectedIdentifierRef.current = 1
        selectedFileIdRef.current = null
        setSearchQueryForFile('')
        setSearchQueryForIdentifier('')
        setSearchResultForFile([])
        setSearchResultForIdentifier([])
        setDefaultFileId(null)
        setDefaultIdentifierId(null)
        close(1)
        toast.success('Fold linked successfully!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })


   const closeFunc = () => {
      selectedIdentifierRef.current = 1
        selectedFileIdRef.current = null
        setSearchQueryForFile('')
        setSearchQueryForIdentifier('')
        setSearchResultForFile([])
        setSearchResultForIdentifier([])
        setDefaultFileId(null)
        setDefaultIdentifierId(null)
        close()
      close(1)
   }
   const linkFoldHandler = () => {
      // if (pageTitle.meta.isValid && pageRoute.meta.isValid) {
         linkFold({
            variables: {
               identifier:selectedIdentifierRef.current,
               fileId: selectedFileIdRef.current
            },
         })
      // }
   }

   React.useEffect(() => {
      const result = identifierOptions.filter(option =>
         option.title.toLowerCase().includes(searchQueryForIdentifier)
      )
      setSearchResultForIdentifier(result)
   }, [searchQueryForIdentifier])

   React.useEffect(() => {
      const result = files.filter(option =>
         option.title.toLowerCase().includes(searchQueryForFile)
      )
      setSearchResultForFile(result)
   }, [searchQueryForFile])

   React.useEffect(()=>{
      console.log("useEffect",foldContext)
      if(Object.keys(foldContext).length ){
         console.log("if under useEffect")
         const identifierId = identifierOptions.filter(option=>option.title === foldContext.identifier).map(opt=>{return opt.id})[0]
         console.log("if under useEffect2",identifierId,foldContext.fileId)
         setDefaultFileId(foldContext.fileId)
         setDefaultIdentifierId(identifierId)
      }
   },[foldContext])

   if(subscriptionError){
        logger(subscriptionError)
      }
   if(subscriptionLoading){
      return <InlineLoader />
   }
   return (
      <>
         <TunnelHeader
            title="Link Subscription Fold"
            right={{
               action: () => linkFoldHandler(),
               title: mutationLoading ? 'Adding...' : 'Add',
            }}
            close={() => closeFunc()}
            tooltip={<Tooltip identifier="subscriptionFold_linking_tunnelHeader" />}
         />
         <TunnelBody>
            <Form.Group>
               <Flex container alignItems="flex-end">
                  <Form.Label htmlFor="name" title="Page Name">
                     Identifier*
                  </Form.Label>
                  <Tooltip identifier="fold_identifier_info" />
               </Flex>
               {searchResultForIdentifier.length>0 && <Dropdown
            type='single'
            defaultValue={defaultIdentifierId || null}
            options={searchResultForIdentifier}
            searchedOption={option=>setSearchQueryForIdentifier(option)}
            selectedOption={option =>selectedOptionforIdentifier(option)}
            placeholder="type what you're looking for..."
         />}
            </Form.Group>
            <Spacer size="16px" />
            <Form.Group>
               <Flex container alignItems="flex-end">
                  <Form.Label htmlFor="name" title="Page URL">
                     Select file*
                  </Form.Label>
                  <Tooltip identifier="page_route_info" />
               </Flex>
               {searchResultForFile.length>0 && <Dropdown
            type='single'
            defaultValue={defaultFileId || null}
            options={searchResultForFile}
            searchedOption={option=>setSearchQueryForFile(option)}
            selectedOption={option =>selectedOptionforFile(option)}
            placeholder="type what you're looking for..."
         />}
            </Form.Group>
         </TunnelBody>
      </>
   )
}
