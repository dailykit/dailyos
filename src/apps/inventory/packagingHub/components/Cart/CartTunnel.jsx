import React from 'react'
import { TunnelHeader } from '@dailykit/ui'

import { TunnelContainer } from '../../../components'

export default function AddressTunnel({ close }) {
   return (
      <>
         <TunnelHeader title="Purchase Orders" close={() => close(1)} />

         <TunnelContainer>
            <h1>I am working...</h1>
         </TunnelContainer>
      </>
   )
}
