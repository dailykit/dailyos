import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader, Flex } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components'
import { UPDATE_BULK_ITEM } from '../../../../../graphql'

export default function PhotoTunnel({ close, bulkItem }) {
   const [udpateBulkItem, { loading }] = useMutation(UPDATE_BULK_ITEM, {
      onCompleted: () => {
         close(1)

         toast.info('Image Added!')
      },
      onError: error => {
         console.log(error)

         toast.error('Error, Please try again')
         close(1)
      },
   })

   const addImage = ({ url }) => {
      udpateBulkItem({
         variables: {
            id: bulkItem.id,
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
