import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../components'

import { useTranslation, Trans } from 'react-i18next'

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
            title={t(address.concat("select type of work order"))}
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
                  Bulk Work Order is to create bulk items with changing processing
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

const SolidTile = styled.button`
   width: 70%;
   display: block;
   margin: 0 auto;
   border: 1px solid #cecece;
   padding: 10px 20px;
   border-radius: 2px;
   background-color: #fff;

   &:hover {
      background-color: #f3f3f3;
      cursor: pointer;
   }
`
