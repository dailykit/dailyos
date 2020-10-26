import { Flex } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Ranger } from '../../../../../shared/components/Ranger'
import { DataCard } from '../../../components'

const address = 'apps.inventory.views.forms.item.'

export default function RealTimeView({ proc }) {
   const { t } = useTranslation()

   if (!proc) return null

   return (
      <Flex margin="48px 48px 0 0">
         <Ranger
            label="On hand qty"
            max={proc.maxLevel}
            min={proc.parLevel}
            minLabel="Par Level"
            maxLabel="Max Inventory qty"
            value={proc.onHand}
            unit={proc.unit}
         />

         <Flex container style={{ flexWrap: 'wrap' }}>
            <DataCard
               title={t(address.concat('awaiting'))}
               quantity={`${proc.awaiting} ${proc.unit}`}
            />
            <DataCard
               title={t(address.concat('commited'))}
               quantity={`${proc.committed} ${proc.unit}`}
            />
            <DataCard
               title={t(address.concat('consumed'))}
               quantity={`${proc.consumed} ${proc.unit}`}
            />
         </Flex>
      </Flex>
   )
}
