import { ButtonTile, Text } from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { DataCard } from '../../../components'
import { ItemContext } from '../../../context/item'
import { FlexContainer, Flexible } from '../styled'
import { ProcessingButton } from './styled'

const address = 'apps.inventory.views.forms.item.'

export default function PlannedLotView({ open, formState }) {
   const { t } = useTranslation()
   const {
      state: { activeProcessing },
      state,
      dispatch,
   } = useContext(ItemContext)

   const active = formState.bulkItems.find(
      item => item.id === activeProcessing.id
   )

   if (!active) return null

   const activeSachet = active.sachetItems.find(
      item => item.id === state.activeSachet.id
   )

   return (
      <>
         <FlexContainer>
            <Flexible width="1">
               <Text as="h2">{t(address.concat('sachets'))}</Text>

               {active.sachetItems.map(sachet => {
                  return (
                     <ProcessingButton
                        active={sachet.id === state.activeSachet.id}
                        onClick={() =>
                           dispatch({
                              type: 'SET_ACTIVE_SACHET',
                              payload: sachet,
                           })
                        }
                     >
                        <div style={{ textAlign: 'left' }}>
                           <h3>
                              {sachet.unitSize} {sachet.unit}
                           </h3>

                           <Text as="subtitle">
                              {t(address.concat('par'))}: {sachet.parLevel}{' '}
                              {sachet.unit}
                           </Text>
                        </div>
                     </ProcessingButton>
                  )
               })}

               <div style={{ width: '90%', marginTop: '10px' }}>
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text={t(address.concat('add sachets'))}
                     onClick={() => {
                        dispatch({
                           type: 'SET_UNIT_QUANTITY',
                           payload: { unit: active.unit },
                        })
                        open(1)
                     }}
                  />
               </div>
            </Flexible>
            <Flexible width="4">
               {(activeSachet?.id || state.activeSachet?.quantity) && (
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
               )}
            </Flexible>
         </FlexContainer>
      </>
   )
}
