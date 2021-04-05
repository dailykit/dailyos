import React, { useRef, useState, useContext } from 'react'
import { Text, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import options from '../../tableOptions'
import { useTooltip, useTabs } from '../../../../../shared/providers'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils'
import { WALLET_LISTING } from '../../../graphql'
import { Tooltip, InlineLoader } from '../../../../../shared/components'
import BrandContext from '../../../context/Brand'
import * as moment from 'moment'

const WalletTable = () => {
   const [context, setContext] = useContext(BrandContext)
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
         brandId: context.brandId,
      },
      onCompleted: ({ walletTransactions = [] } = {}) => {
         const result = walletTransactions.map(transaction => {
            return {
               date:
                  moment(transaction?.created_at).format(
                     'MMMM Do YYYY, h:mm:ss a'
                  ) || 'N/A',
               reference: transaction?.id || 'N/A',
               oid: transaction?.orderCart?.orderId || 'N/A',
               debit:
                  transaction?.type === 'DEBIT'
                     ? `$${transaction?.amount}`
                     : '$0',
               credit:
                  transaction?.type === 'CREDIT'
                     ? `$${transaction?.amount}`
                     : '$0',
            }
         })
         setWalletTxn(result)
         setTxnCount(walletTransactions.length)
      },
      onError: error => {
         toast.error('Something went wrong wallet!')
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
      // {
      //    title: 'Balance',
      //    field: 'balance',
      //    hozAlign: 'right',
      //    titleFormatter: function (cell, formatterParams, onRendered) {
      //       cell.getElement().style.textAlign = 'right'
      //       return '' + cell.getValue()
      //    },
      //    headerTooltip: function (column) {
      //       const identifier = 'wallet_listing_balance_column'
      //       return (
      //          tooltip(identifier)?.description || column.getDefinition().title
      //       )
      //    },
      //    width: 100,
      // },
   ]

   if (listloading) return <InlineLoader />

   return (
      <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
         <Flex container height="80px" padding="16px" alignItems="center">
            <Text as="title">Wallet Transactions({txnCount})</Text>
            <Tooltip identifier="wallet_list_heading" />
         </Flex>
         {Boolean(walletTxn) && (
            <ReactTabulator
               columns={columns}
               data={walletTxn}
               ref={tableRef}
               options={{
                  ...options,
                  placeholder: 'No Wallet Data Available Yet !',
               }}
            />
         )}
      </Flex>
   )
}

export default WalletTable
