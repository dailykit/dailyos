import {
   Filler,
   IconButton,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   SectionTabsListHeader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon } from '../../../../../shared/assets/icons'
import { DataCard } from '../../../components'
import { NO_BULK_ITEMS } from '../../../constants/emptyMessages'
import { FlexContainer } from '../styled'
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
               {sachetItems.map(activeSachet => {
                  return (
                     <SectionTabPanel key={activeSachet.id}>
                        <FlexContainer style={{ flexWrap: 'wrap' }}>
                           <DataCard
                              title={t(address.concat('awaiting'))}
                              quantity={`${activeSachet.awaiting || 0} pkt`}
                           />
                           <DataCard
                              title={t(address.concat('commited'))}
                              quantity={`${activeSachet.committed || 0} pkt`}
                           />
                           <DataCard
                              title={t(address.concat('consumed'))}
                              quantity={`${activeSachet.consumed || 0} pkt`}
                           />
                        </FlexContainer>
                     </SectionTabPanel>
                  )
               })}
            </SectionTabPanels>
         </SectionTabs>
      </>
   )
}
