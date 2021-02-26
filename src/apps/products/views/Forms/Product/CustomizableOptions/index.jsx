import React from 'react'
import { ButtonTile, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'
import { ProductsTunnel } from './tunnels'

const CustomizableOptions = ({ productId, options }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [optionsTunnel, openOptionsTunnel, closeOptionsTunnel] = useTunnel(1)

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductsTunnel
                  productId={productId}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
         </Tunnels>
         {options.length ? (
            <h1>Options there!</h1>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Product Option"
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default CustomizableOptions
