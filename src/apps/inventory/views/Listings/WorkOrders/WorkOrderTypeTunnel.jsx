import { Text } from '@dailykit/ui'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../components'
import { SolidTile } from '../styled'

import {
   CREATE_BULK_WORK_ORDER,
   CREATE_SACHET_WORK_ORDER,
} from '../../../graphql'
import { useTabs } from '../../../context'

const address = 'apps.inventory.views.listings.workorders.'

function onError(error) {
   console.log(error)
   toast.error(error.message)
}

export default function WorkOrderTypeTunnel({ close }) {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const [createBulkWorkOrder] = useMutation(CREATE_BULK_WORK_ORDER, {
      variables: {
         object: {
            name: `Work Order-${uuid().substring(30)}`,
         },
      },
      onError,
      onCompleted: data => {
         const { id, name } = data.createBulkWorkOrder.returning[0]
         addTab(name, `/inventory/work-orders/bulk/${id}`)
      },
   })

   const [createSachetWorkOrder] = useMutation(CREATE_SACHET_WORK_ORDER, {
      variables: {
         object: {
            name: `Work Order-${uuid().substring(30)}`,
         },
      },
      onError,
      onCompleted: data => {
         const { id, name } = data.createSachetWorkOrder.returning[0]
         addTab(name, `/inventory/work-orders/sachet/${id}`)
      },
   })

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
         <SolidTile onClick={createBulkWorkOrder}>
            <Text as="h1">{t(address.concat('bulk work order'))}</Text>
            <Text as="subtitle">
               <Trans i18nKey={address.concat('bulk subtitle 1')}>
                  Bulk Work Order is to create bulk items with changing
                  processing
               </Trans>
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={createSachetWorkOrder}>
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
