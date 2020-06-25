import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { DataCard } from '../../../components'
import { ItemContext } from '../../../context/item'
import { FlexContainer } from '../styled'

const address = 'apps.inventory.views.forms.item.'

export default function RealTimeView({ formState }) {
   const { t } = useTranslation()

   const {
      state: { activeProcessing },
   } = useContext(ItemContext)
   const active = formState.bulkItems.find(
      item => item.id === activeProcessing.id
   )

   if (!active) return null

   return (
      <FlexContainer style={{ flexWrap: 'wrap' }}>
         <DataCard
            title={t(address.concat('awaiting'))}
            quantity={`${active.awaiting} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('commited'))}
            quantity={`${active.committed} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('consumed'))}
            quantity={`${active.consumed} ${active.unit}`}
         />
         <DataCard
            title={t(address.concat('on hand'))}
            quantity={`${active.onHand} ${active.unit}`}
         />
      </FlexContainer>
   )
}
