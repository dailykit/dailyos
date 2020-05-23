import React from 'react'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function CompressibilityTunnel({ close }) {
   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select compressibility"
               next={() => {}}
               close={() => close(6)}
               nextAction="Next"
            />

            <Spacer />
         </TunnelContainer>
      </>
   )
}
