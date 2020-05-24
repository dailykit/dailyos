import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Text,
   Loader,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import moment from 'moment'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import WorkOrderTypeTunnel from './WorkOrderTypeTunnel'
import { Context } from '../../../context/tabs'
import {
   BULK_WORK_ORDERS_SUBSCRIPTION,
   SACHET_WORK_ORDERS_SUBSCRIPTION,
} from '../../../graphql'

import EditIcon from '../../../../recipe/assets/icons/Edit'

const address = 'apps.inventory.views.listings.workorders.'

export default function WorkOrders() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      data: bulkWorkOrdersData,
      loading: bulkWorkOrderLoading,
   } = useSubscription(BULK_WORK_ORDERS_SUBSCRIPTION)

   const {
      data: sachetWorkOrdersData,
      loading: sachetWorkOrderLoading,
   } = useSubscription(SACHET_WORK_ORDERS_SUBSCRIPTION)

   if (bulkWorkOrderLoading && sachetWorkOrderLoading) return <Loader />

   let data = []

   if (
      bulkWorkOrdersData &&
      bulkWorkOrdersData.bulkWorkOrders &&
      sachetWorkOrdersData &&
      sachetWorkOrdersData.sachetWorkOrders
   ) {
      data = [
         ...bulkWorkOrdersData.bulkWorkOrders.map(t => ({
            ...t,
            type: 'bulk',
         })),
         ...sachetWorkOrdersData.sachetWorkOrders.map(t => ({
            ...t,
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
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <DataTable data={data} />

            <br />
         </StyledWrapper>
      </>
   )
}

function DataTable({ data }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const handleClick = workOrder => {
      if (workOrder.type === 'bulk') {
         dispatch({
            type: 'SET_BULK_WORK_ORDER',
            payload: {
               id: workOrder.id,
               status: workOrder.status,
            },
         })
         addTab('Edit Bulk Work Order', 'bulkOrder')
      } else {
         dispatch({
            type: 'SET_SACHET_WORK_ORDER',
            payload: {
               id: workOrder.id,
               status: workOrder.status,
            },
         })
         addTab('Edit Sachet Work Order', 'sachetOrder')
      }
   }

   return (
      <div style={{ width: '95%', margin: '0 auto' }}>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>status</TableCell>
                  <TableCell>scheduled on</TableCell>
                  <TableCell>user</TableCell>
                  <TableCell>station</TableCell>
                  <TableCell>Type</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.map((workOrder, idx) => (
                  <TableRow key={idx} onClick={() => handleClick(workOrder)}>
                     <TableCell>{workOrder.status}</TableCell>
                     <TableCell>
                        {moment(workOrder.scheduledOn).format('MMM Do YY')}
                     </TableCell>
                     <TableCell>
                        {workOrder.user?.firstName} {workOrder.user?.lastName}
                     </TableCell>
                     <TableCell>{workOrder.station?.name}</TableCell>
                     <TableCell>
                        {workOrder.type === 'bulk'
                           ? 'Bulk Work Order'
                           : 'Sachet Work Order'}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}
