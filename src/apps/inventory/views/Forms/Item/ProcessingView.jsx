import { Text } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

// Styled
import { FlexContainer, Flexible } from '../styled'
import { ItemTab, TabContainer } from './styled'

import RealTimeView from './RealtimeView'
import PlannedLotView from './PlannedLot'

const address = 'apps.inventory.views.forms.item.'

export default function ProcessingView({ open, formState }) {
   const { t } = useTranslation()
   const [activeView, setActiveView] = React.useState('realtime') // realtime | plannedLot

   return (
      <>
         <TabContainer>
            <ItemTab
               active={activeView === 'realtime'}
               onClick={() => setActiveView('realtime')}
            >
               <Text as="title">{t(address.concat('real-time'))}</Text>
            </ItemTab>
            <ItemTab
               active={activeView === 'plannedLot'}
               onClick={() => setActiveView('plannedLot')}
            >
               <Text as="title">{t(address.concat('planned-lot'))}</Text>
            </ItemTab>
         </TabContainer>

         {activeView === 'realtime' && (
            <>
               <FlexContainer>
                  <Flexible width="4">
                     <RealTimeView formState={formState} />
                  </Flexible>
                  <Flexible width="1" />
               </FlexContainer>
            </>
         )}

         {activeView === 'plannedLot' && (
            <>
               <PlannedLotView open={open} formState={formState} />
            </>
         )}
      </>
   )
}
