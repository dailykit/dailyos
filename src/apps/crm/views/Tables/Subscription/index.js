import React, { useEffect } from 'react'
import { Text, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import OrderComp from './order'
import { OCCURENCES } from '../../../graphql'
import tableOptions from '../../Listings/tableOptions'
import { NewInfoIcon } from '../../../../../shared/assets/icons'
import { StyledInfo, StyledActionText } from './styled'
import './style.css'

const SubscriptionTable = ({ id, sid }) => {
   const { dispatch, tab } = useTabs()
   const history = useHistory()
   const { loading: listLoading, data: occurencesData } = useQuery(OCCURENCES, {
      variables: {
         keycloakId: id,
         sid,
      },
   })
   useEffect(() => {
      if (!tab) {
         history.push('/crm/customers')
      }
   }, [history, tab])

   const InfoButton = ({ cell }) => {
      const rowData = cell._cell.row.data
      return (
         <Text as="p">
            {rowData.date} &nbsp;&nbsp;
            <StyledInfo>
               <NewInfoIcon size="16" />
               <div>
                  <Text as="subtitle">CutoffTimestamp </Text>
                  <Text as="p">{rowData.startTimeStamp} </Text>
                  <Text as="subtitle">StartTimestamp </Text>
                  <Text as="p">{rowData.cutoffTimeStamp}</Text>
               </div>
            </StyledInfo>
         </Text>
      )
   }

   const ActionText = ({ cell }) => {
      const rowData = cell._cell.row.data
      switch (rowData.action) {
         case 'Skipped':
            return (
               <StyledActionText color="#E6C02A">
                  {`[${rowData.action}]`}
               </StyledActionText>
            )
         case 'Order Placed':
            return (
               <StyledActionText color="#28C1F7">{`[${rowData.action}]`}</StyledActionText>
            )
         case 'Added To Cart':
            return (
               <StyledActionText color="#53C22B">
                  {`[${rowData.action}]`}
               </StyledActionText>
            )
         case 'No Action':
            return (
               <StyledActionText color="#C4C4C4">
                  {rowData.action}
               </StyledActionText>
            )
         default:
            return <StyledActionText>{rowData.action}</StyledActionText>
      }
   }

   const columns = [
      {
         title: 'Fulfillment Date',
         field: 'date',
         headerFilter: true,
         cssClass: 'fulfillmentDate',
         formatter: reactFormatter(<InfoButton />),
      },
      {
         title: 'Action',
         field: 'action',
         formatter: reactFormatter(<ActionText />),
      },
      { title: 'Order Id', field: 'oid' },
      { title: 'Amount Paid', field: 'amountPaid' },
   ]

   const setOrder = React.useCallback(
      (orderId, order) => {
         dispatch({
            type: 'STORE_TAB_DATA',
            payload: {
               path: tab?.path,
               data: { oid: orderId, isOccurencesClicked: order },
            },
         })
      },
      [tab, dispatch]
   )

   useEffect(() => {
      setOrder('', false)
   }, [setOrder])

   const data = []
   if (occurencesData) {
      let action = ''
      occurencesData.subscriptionOccurencesAggregate.nodes.map(occurence => {
         if (
            occurence.customers.length !== 0 &&
            occurence.customers[0].isSkipped
         ) {
            action = 'Skipped'
         } else if (
            occurence.customers.length !== 0 &&
            occurence.customers[0].orderCart &&
            occurence.customers[0].orderCart.orderId
         ) {
            action = 'Order Placed'
         } else if (
            occurence.customers.length !== 0 &&
            occurence.customers[0].orderCart &&
            occurence.customers[0].orderCart.id
         ) {
            action = 'Added To Cart'
         } else {
            action = 'No Action'
         }
         return data.push({
            startTimeStamp: occurence?.startTimeStamp || 'N/A',
            cutoffTimeStamp: occurence?.cutoffTimeStamp || 'N/A',
            date: occurence?.fulfillmentDate || 'N/A',
            action,
            oid: occurence?.customers?.[0]?.orderCart?.orderId || '',
            amountPaid: `$ ${
               occurence?.customers?.[0]?.orderCart?.amount || 'N/A'
            }`,
         })
      })
   }
   const rowClick = (e, row) => {
      const orderId = row._row.data.oid.toString()

      setOrder(orderId, true)
   }
   let showTable = (
      <>
         <div style={{ padding: '16px' }}>
            <Text as="title">
               Occurences(
               {occurencesData?.subscriptionOccurencesAggregate?.occurenceCount
                  ?.count || 'N/A'}
               )
            </Text>
         </div>
         <ReactTabulator
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={tableOptions}
         />
      </>
   )
   if (tab.data.isOccurencesClicked) {
      showTable = <OrderComp />
   }

   if (listLoading) return <Loader />
   return (
      <>
         <div style={{ overflowX: 'scroll' }}>{showTable}</div>
      </>
   )
}

export default SubscriptionTable
