import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { ErrorState, InlineLoader } from '../../../../../shared/components'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { dateFmt } from '../../../../../shared/utils/dateFmt'
import { useTabs } from '../../../context'
import { SACHET_WORK_ORDERS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'

export default function SachetWorkOrders({ tableRef }) {
   const {
      data: { sachetWorkOrders = [] } = {},
      loading,
      error,
   } = useSubscription(SACHET_WORK_ORDERS_SUBSCRIPTION)
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      return <ErrorState />
   }

   const openForm = (_, cell) => {
      const { id, name } = cell.getData()
      const altName = `Work Order-${uuid().substring(30)}`

      addTab(name || altName, `/inventory/work-orders/sachet/${id}`)
   }

   const columns = [
      {
         title: 'Id',
         field: 'id',
         headerFilter: false,
         cellClick: openForm,
         cssClass: 'RowClick',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_id'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Status',
         field: 'status',
         headerFilter: false,
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
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_scheduledOn'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'User Assigned',
         field: 'user.firstName',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_user_assigned'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
      {
         title: 'Station Assigned',
         field: 'station.name',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
         headerTooltip: col => {
            const identifier = 'work-orders_listings_table_station_assigned'
            return tooltip(identifier)?.description || col.getDefinition().title
         },
      },
   ]

   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={sachetWorkOrders}
         options={tableOptions}
      />
   )
}

function ShowDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{dateFmt.format(new Date(value))}</>
}
