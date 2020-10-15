import {
   IconButton,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   SectionTabsListHeader,
   Text,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon } from '../../../../../shared/assets/icons'
import { DataCard } from '../../../components'
import { FlexContainer } from '../styled'

const address = 'apps.inventory.views.forms.item.'

export default function PlannedLotView({ sachetItems = [], open }) {
   const { t } = useTranslation()

   if (!sachetItems.length) return null

   return (
      <>
         <SectionTabs>
            <SectionTabList>
               <SectionTabsListHeader>
                  <Text as="h2">{t(address.concat('sachets'))}</Text>
                  <IconButton
                     type="outline"
                     onClick={() => {
                        open(1)
                     }}
                  >
                     <AddIcon />
                  </IconButton>
               </SectionTabsListHeader>
               {sachetItems.map(sachet => {
                  return (
                     <SectionTab>
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
                     <SectionTabPanel>
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
