import { Text } from '@dailykit/ui'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../components'
import { Context } from '../../../context/tabs'
import { SolidTile } from '../styled'

const address = 'apps.inventory.views.listings.workorders.'

export default function WorkOrderTypeTunnel({ close }) {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }
   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select type of work order'))}
            close={() => {
               close(1)
            }}
            next={() => {
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <SolidTile onClick={() => addTab('Bulk Work Order', 'bulkOrder')}>
            <Text as="h1">{t(address.concat('bulk work order'))}</Text>
            <Text as="subtitle">
               <Trans i18nKey={address.concat('bulk subtitle 1')}>
                  Bulk Work Order is to create bulk items with changing
                  processing
               </Trans>
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={() => addTab('Sachet Work Order', 'sachetOrder')}>
            <Text as="h1">{t(address.concat('sachet work order'))}</Text>
            <Text as="subtitle">
               <Trans i18nKey={address.concat('sachet subtitle 1')}>
                  Sachet Work Order is to create planned lot items by portioning
                  and packaging
               </Trans>
            </Text>
         </SolidTile>
      </TunnelContainer>
   )
}
