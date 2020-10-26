import { Flex, Spacer, Text } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from '../../../../../shared/assets/icons'
import { Ranger } from '../../../../../shared/components/Ranger'
import { DataCard } from '../../../components'

const address = 'apps.inventory.views.forms.item.'

export default function RealTimeView({ proc }) {
   const { t } = useTranslation()
   const [showHistory, setShowHistory] = useState(false)

   if (!proc) return null

   return (
      <Flex margin="64px 48px 0 0">
         {showHistory && <BreadCrumb setShowHistory={setShowHistory} />}
         {showHistory ? (
            <HistoryTable proc={proc} />
         ) : (
            <>
               <Ranger
                  label="On hand qty"
                  max={proc.maxLevel}
                  min={proc.parLevel}
                  minLabel="Par Level"
                  maxLabel="Max Inventory qty"
                  value={proc.onHand}
                  unit={proc.unit}
               />
               <Spacer size="16px" />
               <Flex container style={{ flexWrap: 'wrap' }}>
                  <DataCard
                     title={t(address.concat('awaiting'))}
                     quantity={`${proc.awaiting} ${proc.unit}`}
                  />
                  <Spacer xAxis size="16px" />
                  <DataCard
                     title={t(address.concat('commited'))}
                     quantity={`${proc.committed} ${proc.unit}`}
                  />
                  <Spacer xAxis size="16px" />
                  <DataCard
                     title={t(address.concat('consumed'))}
                     quantity={`${proc.consumed} ${proc.unit}`}
                     actionText="view history"
                     action={() => setShowHistory(true)}
                  />
               </Flex>
            </>
         )}
      </Flex>
   )
}

function HistoryTable() {
   return <h1>TODO: get data and show table here: bulkItemHistories</h1>
}

function BreadCrumb({ setShowHistory }) {
   return (
      <Flex container>
         <Text
            as="h3"
            style={{ color: '#00A7E1' }}
            role="button"
            onClick={() => setShowHistory(false)}
         >
            Bulk Item
         </Text>

         <ChevronRight />

         <Text as="h3">History</Text>
      </Flex>
   )
}
