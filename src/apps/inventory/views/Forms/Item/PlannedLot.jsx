import {
   Filler,
   Flex,
   IconButton,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   SectionTabsListHeader,
   Spacer,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, ChevronRight } from '../../../../../shared/assets/icons'
import { Ranger } from '../../../../../shared/components/Ranger'
import { DataCard } from '../../../components'
import {
   NO_BULK_ITEMS,
   NO_SACHET_ITEMS,
} from '../../../constants/emptyMessages'
import { ConfigureSachetTunnel } from './tunnels'

const address = 'apps.inventory.views.forms.item.'

export default function PlannedLotView({ sachetItems = [], procId, unit }) {
   const { t } = useTranslation()
   const [
      configureSachetTunnel,
      openConfigureSachetTunnel,
      closeConfigureSachetTunnel,
   ] = useTunnel(1)

   if (!procId) return <Filler message={NO_BULK_ITEMS} />

   return (
      <>
         <Tunnels tunnels={configureSachetTunnel}>
            <Tunnel layer={1}>
               <ConfigureSachetTunnel
                  open={openConfigureSachetTunnel}
                  close={closeConfigureSachetTunnel}
                  procId={procId}
                  unit={unit}
               />
            </Tunnel>
         </Tunnels>

         <SectionTabs>
            <SectionTabList>
               <SectionTabsListHeader>
                  <Text as="h2">{t(address.concat('sachets'))}</Text>
                  <IconButton
                     type="outline"
                     onClick={() => {
                        openConfigureSachetTunnel(1)
                     }}
                  >
                     <AddIcon />
                  </IconButton>
               </SectionTabsListHeader>
               {sachetItems.map(sachet => {
                  return (
                     <SectionTab key={sachet.id}>
                        <div style={{ textAlign: 'left', padding: '14px' }}>
                           <h3>
                              {sachet.unitSize} {sachet.unit}
                           </h3>

                           <Text as="subtitle">
                              {t(address.concat('par'))}: {sachet.parLevel}{' '}
                              {sachet.unit}
                           </Text>
                        </div>
                     </SectionTab>
                  )
               })}
            </SectionTabList>

            <SectionTabPanels>
               {sachetItems.length ? (
                  sachetItems.map(activeSachet => {
                     return (
                        <SectionTabPanel key={activeSachet.id}>
                           <PlannedLotStats sachet={activeSachet} />
                        </SectionTabPanel>
                     )
                  })
               ) : (
                  <Filler message={NO_SACHET_ITEMS} />
               )}
            </SectionTabPanels>
         </SectionTabs>
      </>
   )
}

function PlannedLotStats({ sachet }) {
   const { t } = useTranslation()
   const [showHistory, setShowHistory] = useState(false)

   return (
      <>
         {showHistory && <BreadCrumb setShowHistory={setShowHistory} />}
         {showHistory ? (
            <SachetHistories sachetId={sachet.id} />
         ) : (
            <Flex margin="54px 0 0 0">
               <Ranger
                  label="On hand qty"
                  max={sachet.maxLevel}
                  min={sachet.parLevel}
                  maxLabel="Max Inventory qty"
                  minLabel="Par Level"
                  value={sachet.onHand}
               />
               <Spacer size="16px" />
               <Flex container style={{ flexWrap: 'wrap' }}>
                  <DataCard
                     title={t(address.concat('awaiting'))}
                     quantity={`${sachet.awaiting || 0} pkt`}
                  />
                  <Spacer xAxis size="16px" />
                  <DataCard
                     title={t(address.concat('commited'))}
                     quantity={`${sachet.committed || 0} pkt`}
                  />
                  <Spacer xAxis size="16px" />
                  <DataCard
                     title={t(address.concat('consumed'))}
                     quantity={`${sachet.consumed || 0} pkt`}
                     actionText="view history"
                     action={() => setShowHistory(true)}
                  />
               </Flex>
            </Flex>
         )}
      </>
   )
}

function SachetHistories({ sachetId }) {
   return <h1>TODO: replace this with history table</h1>
}

function BreadCrumb({ setShowHistory }) {
   return (
      <Flex container margin="0 0 16px 0">
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
