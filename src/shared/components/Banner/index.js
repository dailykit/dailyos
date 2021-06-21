import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { webRenderer } from '@dailykit/web-renderer'
import { GET_BANNER_DATA } from '../../graphql'
import { formatWebRendererData } from '../../utils'
import { IconButton, CloseIcon } from '@dailykit/ui'
import styled from 'styled-components'

const Banner = ({ id }) => {
   const [bannerFiles, setBannerFiles] = React.useState([])

   const handleClose = () => {}
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

   return (
      <>
         {bannerFiles.length > 0 &&
            bannerFiles.map(file => (
               <Wrapper key={`${id}-${file.file.id}`}>
                  {file.divId === id && (
                     <>
                        <CloseButton
                           onClick={handleClose}
                           type="ghost"
                           size="sm"
                        >
                           <CloseIcon color="#367BF5" />
                        </CloseButton>
                        <div id={`${id}-${file.file.id}`} />
                     </>
                  )}
               </Wrapper>
            ))}
      </>
   )
}

export default Banner

const Wrapper = styled.div`
   position: relative;
   display: block;
`
const CloseButton = styled(IconButton)`
   position: absolute;
   right: 0;
   top: 0;
`
