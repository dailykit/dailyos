import { Text, Card, TextButton } from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

// Styled
import { FlexContainer, Flexible } from '../styled'
import { ItemTab, TabContainer } from './styled'

import RealTimeView from './RealtimeView'
import PlannedLotView from './PlannedLot'
import { ItemContext } from '../../../context/item'

const address = 'apps.inventory.views.forms.item.'

export default function ProcessingView({ open, formState }) {
   const { t } = useTranslation()
   const [activeView, setActiveView] = React.useState('realtime') // realtime | plannedLot
   const {
      state: { activeProcessing },
   } = useContext(ItemContext)

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
                  <Flexible width="1">
                     <Card>
                        <Card.Title>{activeProcessing.name}</Card.Title>
                        <Card.Img
                           src={activeProcessing.image}
                           alt="processing"
                        />
                        <Card.Body>
                           <Card.Text>
                              <Card.Stat>
                                 <span>Bulk Density:</span>
                                 <span>{activeProcessing.bulkDensity}</span>
                              </Card.Stat>
                           </Card.Text>
                           <Card.Text>
                              <Card.Stat>
                                 <span>% of yield:</span>
                                 <span>
                                    {activeProcessing.yield.value || 'N/A'}
                                 </span>
                              </Card.Stat>
                           </Card.Text>
                           <Card.Text>
                              <Card.Stat>
                                 <span>Labour time per unit:</span>
                                 <span>{`${
                                    activeProcessing.labor?.value || 'N/A'
                                 } ${
                                    activeProcessing.labor?.unit || ''
                                 }`}</span>
                              </Card.Stat>
                           </Card.Text>

                           <Card.Text>
                              <Card.Stat>
                                 <span>Shelf life:</span>
                                 <span>{`${
                                    activeProcessing.shelfLife?.value || 'N/A'
                                 } ${
                                    activeProcessing.shelfLife?.unit || ''
                                 }`}</span>
                              </Card.Stat>
                           </Card.Text>
                        </Card.Body>
                     </Card>
                  </Flexible>
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
