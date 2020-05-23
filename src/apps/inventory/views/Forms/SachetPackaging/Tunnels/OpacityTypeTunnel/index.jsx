import React from 'react'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function OpacityTypeTunnel({ close }) {
   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select opacity type"
               next={() => {}}
               close={() => close(5)}
               nextAction="Next"
            />

            <Spacer />
         </TunnelContainer>
      </>
   )
}
