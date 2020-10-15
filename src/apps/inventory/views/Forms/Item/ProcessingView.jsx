import {
   Card,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
// Styled
import { FlexContainer, Flexible } from '../styled'
import PlannedLotView from './PlannedLot'
import RealTimeView from './RealtimeView'

const address = 'apps.inventory.views.forms.item.'

export default function ProcessingView({ proc = {} }) {
   const { t } = useTranslation()

   console.log(proc)

   return (
      <>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>{t(address.concat('real-time'))}</HorizontalTab>
               <HorizontalTab>{t(address.concat('planned-lot'))}</HorizontalTab>
            </HorizontalTabList>

            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <RealtimePanel proc={proc} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <PlannedLotView sachetItems={proc.sachetItems} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </>
   )
}

function RealtimePanel({ proc }) {
   return (
      <FlexContainer>
         <Flexible width="4">
            <RealTimeView proc={proc} />
         </Flexible>
         <Flexible width="1">
            <Card>
               <Card.Title>{proc.name}</Card.Title>
               <Card.Img src={proc.image} alt="processing" />
               <Card.Body>
                  <Card.Text>
                     <Card.Stat>
                        <span>Bulk Density:</span>
                        <span>{proc.bulkDensity}</span>
                     </Card.Stat>
                  </Card.Text>
                  <Card.Text>
                     <Card.Stat>
                        <span>% of yield:</span>
                        <span>{proc.yield?.value || 'N/A'}</span>
                     </Card.Stat>
                  </Card.Text>
                  <Card.Text>
                     <Card.Stat>
                        <span>Labour time per unit:</span>
                        <span>{`${proc.labor?.value || 'N/A'} ${
                           proc.labor?.unit || ''
                        }`}</span>
                     </Card.Stat>
                  </Card.Text>

                  <Card.Text>
                     <Card.Stat>
                        <span>Shelf life:</span>
                        <span>{`${proc.shelfLife?.value || 'N/A'} ${
                           proc.shelfLife?.unit || ''
                        }`}</span>
                     </Card.Stat>
                  </Card.Text>
               </Card.Body>
            </Card>
         </Flexible>
      </FlexContainer>
   )
}
