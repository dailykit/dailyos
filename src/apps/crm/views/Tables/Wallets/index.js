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
import { WALLET_LISTING } from '../../../graphql'
import { Tooltip, InlineLoader } from '../../../../../shared/components'

const WalletTable = () => {
   const { addTab } = useTabs()
   const tableRef = useRef()
   const { tooltip } = useTooltip()
   const { id } = useParams()
   const [walletTxn, setWalletTxn] = useState([])
   const [txnCount, setTxnCount] = useState(0)

   // Query
   const { loading: listloading } = useQuery(WALLET_LISTING, {
      variables: {
         keycloakId: id,
      },
      onCompleted: ({
         customer: { wallet: { walletTransactions_aggregate = {} } = {} } = {},
      }) => {
         console.log(walletTransactions_aggregate)
         const result = walletTransactions_aggregate?.nodes.map(wallet => {
            return {
               date: wallet?.created_at || 'N/A',
               reference: wallet?.id || 'N/A',
               oid: wallet?.orderCart?.orderId || 'N/A',
               debit: wallet.type === 'DEBIT' ? `$${wallet?.amount}` : '$0',
               credit: wallet.type === 'CREDIT' ? `$${wallet?.amount}` : '$0',
               balance: wallet?.wallet?.balanceAmount || 'N/A',
            }
         })
         setWalletTxn(result)
         setTxnCount(walletTransactions_aggregate?.aggregate?.count || 0)
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
            const identifier = 'wallet_listing_txnDate_column'
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
            const identifier = 'wallet_listing_referenceId_column'
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
            const identifier = 'wallet_listing_oid_column'
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
            const identifier = 'wallet_listing_debit_column'
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
            const identifier = 'wallet_listing_credit_column'
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
            const identifier = 'wallet_listing_balance_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 100,
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data

      const param = '/crm/customers/'.concat(name)
      addTab(name, param)
   }

   if (listloading) return <InlineLoader />

   return (
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         <Flex container height="80px" padding="16px" alignItems="center">
            <Text as="title">Wallet Transactions({txnCount})</Text>
            <Tooltip identifier="wallet_list_heading" />
         </Flex>
         <ReactTabulator
            columns={columns}
            data={walletTxn}
            // rowClick={rowClick}
            ref={tableRef}
            options={{
               ...options,
               placeholder: 'No Wallet Data Available Yet !',
            }}
         />
      </Flex>
   )
}

export default WalletTable
