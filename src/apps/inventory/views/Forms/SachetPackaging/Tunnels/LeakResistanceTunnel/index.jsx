import React from 'react'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'

export default function LeakResistanceTunnel({ close }) {
   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select leak resistance"
               next={() => {}}
               close={() => close(4)}
               nextAction="Next"
            />

            <Spacer />
         </TunnelContainer>
      </>
   )
}
