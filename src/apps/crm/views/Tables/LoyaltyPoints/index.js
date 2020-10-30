import React, { useRef, useState } from 'react'
import { Text, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useParams } from 'react-router-dom'
import { useTabs } from '../../../context'
import { useQuery } from '@apollo/react-hooks'
import options from '../../tableOptions'
import { useTooltip } from '../../../../../shared/providers'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'
import { LOYALTYPOINTS_LISTING } from '../../../graphql'
import { Tooltip, InlineLoader } from '../../../../../shared/components'

const LoyaltyPointTable = () => {
   const { addTab } = useTabs()
   const tableRef = useRef()
   const { tooltip } = useTooltip()
   const { id } = useParams()
   const [loyaltyPointTxn, setLoyaltyPointTxn] = useState([])
   const [txnCount, setTxnCount] = useState(0)

   // Query
   const { loading: listloading } = useQuery(LOYALTYPOINTS_LISTING, {
      variables: {
         keycloakId: id,
      },
      onCompleted: ({
         customer: {
            loyaltyPoint: { loyaltyPointTransactions_aggregate = {} } = {},
         } = {},
      }) => {
         const result = loyaltyPointTransactions_aggregate?.nodes.map(
            loyaltyPnt => {
               return {
                  date: loyaltyPnt?.created_at || 'N/A',
                  reference: loyaltyPnt?.id || 'N/A',
                  oid: loyaltyPnt?.orderCart?.orderId || 'N/A',
                  debit:
                     loyaltyPnt.type === 'DEBIT'
                        ? `$${loyaltyPnt?.points}`
                        : '$0',
                  credit:
                     loyaltyPnt.type === 'CREDIT'
                        ? `$${loyaltyPnt?.points}`
                        : '$0',
                  balance: loyaltyPnt?.loyaltyPoint?.balanceAmount || 'N/A',
               }
            }
         )
         setLoyaltyPointTxn(result)
         setTxnCount(loyaltyPointTransactions_aggregate?.aggregate?.count || 0)
      },
      onError: error => {
         toast.error('Something went wrong !')
         logger(error)
      },
   })

   const columns = [
      {
         title: 'Transaction Date',
         field: 'date',
         headerFilter: true,
         hozAlign: 'left',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'left'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyaltyPoints_listing_txnDate_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Reference number',
         field: 'reference',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyaltyPoints_listing_referenceId_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Order Id',
         field: 'oid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyaltyPoints_listing_oid_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
      },
      {
         title: 'Debit',
         field: 'debit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyatlyPoints_listing_debit_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
      {
         title: 'Credit',
         field: 'credit',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyaltyPoints_listing_credit_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
      {
         title: 'Balance',
         field: 'balance',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'loyaltyPoints_listing_balance_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
   ]

   if (listloading) return <InlineLoader />

   return (
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         <Flex container height="80px" padding="16px" alignItems="center">
            <Text as="title">Loyalty Points Transactions({txnCount})</Text>
            <Tooltip identifier="loyaltyPoints_list_heading" />
         </Flex>
         <ReactTabulator
            columns={columns}
            data={loyaltyPointTxn}
            ref={tableRef}
            options={{
               ...options,
               placeholder: 'No Loyalty Points Data Available Yet !',
            }}
         />
      </Flex>
   )
}

export default LoyaltyPointTable
