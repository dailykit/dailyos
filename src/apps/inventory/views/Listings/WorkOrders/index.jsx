import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   ComboButton,
   Flex,
   IconButton,
   Loader,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { Tooltip } from '../../../../../shared/components/Tooltip'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { AddIcon } from '../../../assets/icons'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { useTabs } from '../../../context'
import {
   BULK_WORK_ORDERS_SUBSCRIPTION,
   SACHET_WORK_ORDERS_SUBSCRIPTION,
} from '../../../graphql'
import { FlexContainer } from '../../Forms/styled'
import { StyledHeader, StyledWrapper } from '../styled'
import tableOptions from '../tableOption'
import WorkOrderTypeTunnel from './WorkOrderTypeTunnel'

const address = 'apps.inventory.views.listings.workorders.'

function onError(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
}

export default function WorkOrders() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const tableRef = React.useRef()
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   const {
      data: bulkWorkOrdersData,
      loading: bulkWorkOrderLoading,
      error: bulkError,
   } = useSubscription(BULK_WORK_ORDERS_SUBSCRIPTION)

   const {
      data: sachetWorkOrdersData,
      loading: sachetWorkOrderLoading,
      error: sachetError,
   } = useSubscription(SACHET_WORK_ORDERS_SUBSCRIPTION)

   if (bulkError || sachetError) {
      onError(bulkError || sachetError)
      return
   }

   const openForm = (_, cell) => {
      const { id, type, name } = cell.getData()
      const altName = `Work Order-${uuid().substring(30)}`

      if (type === 'bulk') {
         addTab(name || altName, `/inventory/work-orders/bulk/${id}`)
      } else {
         addTab(name || altName, `/inventory/work-orders/sachet/${id}`)
      }
   }

   const columns = [
      {
         title: 'Status',
         field: 'status',
         headerFilter: true,
         width: 150,
         cellClick: openForm,
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_status'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Scheduled On',
         field: 'scheduledOn',
         headerFilter: false,
         formatter: reactFormatter(<ShowDate />),
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 150,
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_scheduledOn'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'User Assigned',
         field: 'user',
         formatter: reactFormatter(<UserName />),
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_user_assigned'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Station Assigned',
         field: 'station',
         formatter: reactFormatter(<StationName />),
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_station_assigned'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Type',
         field: 'type',
         formatter: reactFormatter(<FormatType />),
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_order_type'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   if (bulkWorkOrderLoading && sachetWorkOrderLoading) return <Loader />

   let data = []

   if (
      bulkWorkOrdersData &&
      bulkWorkOrdersData.bulkWorkOrders &&
      sachetWorkOrdersData &&
      sachetWorkOrdersData.sachetWorkOrders
   ) {
      data = [
         ...bulkWorkOrdersData.bulkWorkOrders.map(bulkOrders => ({
            ...bulkOrders,
            type: 'bulk',
         })),
         ...sachetWorkOrdersData.sachetWorkOrders.map(sachetOrders => ({
            ...sachetOrders,
            type: 'sachet',
         })),
      ]
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <WorkOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Flex container alignItems="center">
                  <Text as="h1">{t(address.concat('work orders'))}</Text>
                  <Tooltip identifier="work-orders_listings_header_title" />
               </Flex>
               <FlexContainer>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <span style={{ width: '10px' }} />
                  <ComboButton
                     type="solid"
                     onClick={() => {
                        openTunnel(1)
                     }}
                  >
                     <AddIcon color="#fff" size={24} />
                     Create Work Order
                  </ComboButton>
               </FlexContainer>
            </StyledHeader>

            <br />
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={data}
               options={tableOptions}
            />
         </StyledWrapper>
      </>
   )
}

function ShowDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{moment(value).format('MMM Do YY')}</>
}

function UserName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.firstName) return <>{value.firstName}</>
   return 'NA'
}

function StationName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return 'NA'
}

function FormatType({
   cell: {
      _cell: { value },
   },
}) {
   if (value)
      return <>{value === 'bulk' ? 'Bulk Work Order' : 'Sachet Work Order'}</>

   return 'NA'
}
