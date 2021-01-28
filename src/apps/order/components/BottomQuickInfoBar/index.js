import React from 'react'
import { currencyFmt } from '../../../../shared/utils'
import { Wrapper } from './styled'

const BottomQuickInfoBar = ({ openOrderSummaryTunnel }) => {
   return (
      <Wrapper variant="ALL" onClick={() => openOrderSummaryTunnel(1)}>
         <header>
            <h2>{'ALL'}</h2>
            <span title="Average">{currencyFmt(Number(72.0) || 0)}</span>
         </header>
         <main>
            <span>{18}</span>
            <span title="Total">{currencyFmt(Number(5000) || 0)}</span>
         </main>
      </Wrapper>
   )
}

export default BottomQuickInfoBar
