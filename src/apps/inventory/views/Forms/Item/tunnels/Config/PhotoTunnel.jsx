import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components'
import { UPDATE_BULK_ITEM } from '../../../../../graphql'
import { BULK_ITEM_IMAGE_ADDED } from '../../../../../constants/successMessages'
import { logger } from '../../../../../../../shared/utils/errorLog'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'

export default function PhotoTunnel({ close, bulkItemId }) {
   const [udpateBulkItem, { loading }] = useMutation(UPDATE_BULK_ITEM, {
      onCompleted: () => {
         close(1)

         toast.info(BULK_ITEM_IMAGE_ADDED)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
   })

   const addImage = ({ url }) => {
      udpateBulkItem({
         variables: {
            id: bulkItemId,
            object: {
               image: url,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader title="Select Image" close={() => close(1)} />
         <Flex padding="0 14px">
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </Flex>
      </>
   )
}
