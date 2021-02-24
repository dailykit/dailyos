import React from 'react'
import { ButtonTile, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'

import { ProductOptionTypeTunnel } from './tunnels'
import { useMutation } from '@apollo/react-hooks'
import { PRODUCT_OPTION } from '../../../../graphql'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../shared/utils'

const ProductOptions = ({ productId }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   const [createProductOption] = useMutation(PRODUCT_OPTION.CREATE, {
      onCompleted: () => {
         toast.success('Option created.')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const handleAddOption = () => {
      createProductOption({
         variables: {
            object: {
               productId,
            },
         },
      })
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductOptionTypeTunnel
                  openTunnel={openTunnel}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
         </Tunnels>
         <ButtonTile
            type="secondary"
            text="Add Option"
            onClick={handleAddOption}
         />
      </>
   )
}

export default ProductOptions
