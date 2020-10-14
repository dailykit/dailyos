import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader, Flex } from '@dailykit/ui'

import { UPDATE_SUPPLIER } from '../../../../graphql'
import { AssetUploader } from '../../../../../../shared/components'
import { GENERAL_ERROR_MESSAGE } from '../../../../constants/errorMessages'

export default function LogoTunnel({ close, formState }) {
   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info(SUPPLIER_LOGO_ADDED)
         close(1)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
   })

   const addImage = ({ url }) => {
      updateSupplier({ variables: { id: formState.id, object: { logo: url } } })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader title="Select Photo" close={() => close(1)} />
         <Flex padding="0 14px">
            <AssetUploader
               onAssetUpload={url => addImage(url)}
               onImageSelect={image => addImage(image)}
            />
         </Flex>
      </>
   )
}
