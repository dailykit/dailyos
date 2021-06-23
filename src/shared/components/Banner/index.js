import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { webRenderer } from '@dailykit/web-renderer'
import { GET_BANNER_DATA, UPDATE_BANNER_CLOSE_COUNT } from '../../graphql'
import { formatWebRendererData } from '../../utils'
import { useBanner } from '../../providers'
import BannerFile from './BannerFile'

const Banner = ({ id }) => {
   const banner = useBanner()
   const [bannerFiles, setBannerFiles] = React.useState([])
   useSubscription(GET_BANNER_DATA, {
      skip: !id || !banner.userEmail,
      variables: {
         id,
         params: banner,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { ux_dailyosDivId = [] } = {} } = {},
      }) => {
         if (ux_dailyosDivId.length) {
            const [banner] = ux_dailyosDivId
            const divFiles = banner.dailyosDivIdFiles
            const files = divFiles.map(divFile => divFile?.file?.id)
            setBannerFiles(divFiles)

            if (files.length && divFiles.length) {
               divFiles.forEach(divFile => {
                  const isValid =
                     divFile.divId === id && divFile.condition.isValid

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
         }
      },
   })

   const [updateBannerCloseCount] = useMutation(UPDATE_BANNER_CLOSE_COUNT, {
      skip: !banner.userEmail,
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
               <BannerFile
                  key={`${id}-${file.file.id}`}
                  file={file}
                  id={id}
                  handleClose={handleClose}
                  userEmail={banner.userEmail}
               />
            ))}
      </>
   )
}

export default Banner
