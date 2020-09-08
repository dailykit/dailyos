import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   Loader,
   TextButton,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useSubscription } from '@apollo/react-hooks'
import moment from 'moment'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import WorkOrderTypeTunnel from './WorkOrderTypeTunnel'
import { Context } from '../../../context/tabs'
import {
   BULK_WORK_ORDERS_SUBSCRIPTION,
   SACHET_WORK_ORDERS_SUBSCRIPTION,
} from '../../../graphql'
import tableOptions from '../tableOption'
import { FlexContainer } from '../../Forms/styled'

const address = 'apps.inventory.views.listings.workorders.'

function onError(error) {
   console.log(error)
   toast.error(error.message)
}

export default function WorkOrders() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const tableRef = React.useRef()
   const { dispatch } = React.useContext(Context)

   const {
      data: bulkWorkOrdersData,
      loading: bulkWorkOrderLoading,
   } = useSubscription(BULK_WORK_ORDERS_SUBSCRIPTION, { onError })

   const {
      data: sachetWorkOrdersData,
      loading: sachetWorkOrderLoading,
   } = useSubscription(SACHET_WORK_ORDERS_SUBSCRIPTION, { onError })

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   const rowClick = (e, row) => {
      const { id, type, name } = row._row.data
      const altName = `Work Order-${uuid().substring(30)}`

      if (type === 'bulk') {
         addTab(name || altName, 'bulkOrder', id)
      } else {
         addTab(name || altName, 'sachetOrder', id)
      }
   }

   const columns = [
      { title: 'Status', field: 'status', headerFilter: true },
      {
         title: 'Scheduled On',
         field: 'scheduledOn',
         headerFilter: false,
         formatter: reactFormatter(<ShowDate />),
      },
      {
         title: 'User Assigned',
         field: 'user',
         formatter: reactFormatter(<UserName />),
         headerFilter: false,
      },
      {
         title: 'Station Assigned',
         field: 'station',
         formatter: reactFormatter(<StationName />),
         headerFilter: false,
      },
      {
         title: 'Type',
         field: 'type',
         formatter: reactFormatter(<FormatType />),
         headerFilter: false,
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
            <Tunnel layer={1}>
               <WorkOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">{t(address.concat('work orders'))}</Text>
               <FlexContainer>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <span style={{ width: '10px' }} />
                  <IconButton
                     type="solid"
                     onClick={() => {
                        openTunnel(1)
                     }}
                  >
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </FlexContainer>
            </StyledHeader>

            <br />
            <div style={{ width: '90%', margin: '0 auto' }}>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={data}
                  rowClick={rowClick}
                  options={tableOptions}
               />
            </div>
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
