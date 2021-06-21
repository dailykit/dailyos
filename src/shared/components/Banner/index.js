import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { webRenderer } from '@dailykit/web-renderer'
import {
   GET_BANNER_DATA,
   UPDATE_BANNER_CLOSE_COUNT,
   UPDATE_SHOWN_COUNT,
} from '../../graphql'
import { formatWebRendererData } from '../../utils'
import { IconButton, CloseIcon } from '@dailykit/ui'
import styled from 'styled-components'
import useIsOnViewPort from '../../hooks/useIsOnViewport'

const Banner = ({ id }) => {
   const [bannerFiles, setBannerFiles] = React.useState([])
   useSubscription(GET_BANNER_DATA, {
      skip: !id,
      variables: {
         id,
         params: { userEmail: 'test@dailykit.org' },
      },
      onSubscriptionData: async ({
         subscriptionData: { data: { ux_dailyosDivId = [] } = {} } = {},
      }) => {
         const [banner] = ux_dailyosDivId
         const divFiles = banner.dailyosDivIdFiles

         const files = divFiles.map(divFile => divFile?.file?.id)
         setBannerFiles(divFiles)

         if (files.length && divFiles.length) {
            divFiles.forEach(divFile => {
               const isValid = divFile.divId === id

               const result = formatWebRendererData([divFile])
               if (isValid) {
                  webRenderer({
                     type: 'file',
                     config: {
                        uri: process.env.REACT_APP_DATA_HUB_URI,
                        adminSecret:
                           process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
                        expressUrl: process.env.REACT_APP_EXPRESS_URL,
                     },
                     fileDetails: result,
                  })
               }
            })
         }
      },
   })

   const [updateBannerCloseCount] = useMutation(UPDATE_BANNER_CLOSE_COUNT, {
      onError: error => console.error(error),
   })

   const handleClose = args =>
      updateBannerCloseCount({
         variables: args,
      })

   return (
      <>
         {bannerFiles.length > 0 &&
            bannerFiles.map(file => (
               <BannerFile file={file} id={id} handleClose={handleClose} />
            ))}
      </>
   )
}

export default Banner

const BannerFile = ({ file, id, handleClose }) => {
   const [isOpen, setIsOpen] = React.useState(true)
   const ref = React.useRef()
   const isOnViewport = useIsOnViewPort(ref)
   const [updateShownCount] = useMutation(UPDATE_SHOWN_COUNT, {
      onError: err => console.error(err),
      variables: {
         userEmail: 'test@dailykit.org',
         divId: file.divId,
         fileId: file.file.id,
      },
   })

   React.useEffect(() => {
      if (isOnViewport) {
         updateShownCount()
      }
   }, [isOnViewport])

   return (
      <Wrapper key={`${id}-${file.file.id}`} isOpen={isOpen} ref={ref}>
         {file.divId === id && (
            <>
               <CloseButton
                  onClick={() => {
                     handleClose({
                        userEmail: 'test@dailykit.org',
                        divId: file.divId,
                        fileId: file.file.id,
                     })
                     setIsOpen(false)
                  }}
                  type="ghost"
                  size="sm"
               >
                  <CloseIcon color="#367BF5" />
               </CloseButton>
               <div id={`${id}-${file.file.id}`} />
            </>
         )}
      </Wrapper>
   )
}

const Wrapper = styled.div`
   position: relative;
   display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`
const CloseButton = styled(IconButton)`
   position: absolute;
   right: 0;
   top: 0;
`
