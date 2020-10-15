import React, { useEffect, useState, useRef } from 'react'
import { Text, Loader, Flex } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTabs } from '../../../context'
import OrderComp from './order'
import { OCCURENCES } from '../../../graphql'
import { NewInfoIcon } from '../../../../../shared/assets/icons'
import { StyledInfo, StyledActionText } from './styled'
import options from '../../tableOptions'
import { Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import { toast } from 'react-toastify'

const SubscriptionTable = ({ id, sid }) => {
   const { dispatch, tab } = useTabs()
   const history = useHistory()
   const [occurences, setOccurences] = useState([])
   const tableRef = useRef(null)
   const { loading: listLoading, data: occurencesData } = useQuery(OCCURENCES, {
      variables: {
         keycloakId: id,
         sid,
      },
      onCompleted: ({ subscriptionOccurencesAggregate = {} }) => {
         let action = ''
         const result = subscriptionOccurencesAggregate.nodes.map(occurence => {
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
            return {
               startTimeStamp: occurence?.startTimeStamp || 'N/A',
               cutoffTimeStamp: occurence?.cutoffTimeStamp || 'N/A',
               date: occurence?.fulfillmentDate || 'N/A',
               action,
               oid: occurence?.customers?.[0]?.orderCart?.orderId || 'N/A',
               amountPaid: `$ ${
                  occurence?.customers?.[0]?.orderCart?.amount || 'N/A'
               }`,
            }
         })
         setOccurences(result)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
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
         cellClick: (e, cell) => {
            rowClick(e, cell)
         },
         formatter: reactFormatter(<InfoButton />),
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Action',
         field: 'action',
         formatter: reactFormatter(<ActionText />),
         hozAlign: 'center',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 200,
      },
      {
         title: 'Order Id',
         field: 'oid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Amount Paid',
         field: 'amountPaid',
         hozAlign: 'right',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'right'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   const setOrder = (orderId, order) => {
      dispatch({
         type: 'STORE_TAB_DATA',
         payload: {
            path: tab?.path,
            data: { oid: orderId, isOccurencesClicked: order },
         },
      })
   }

   useEffect(() => {
      setOrder('', false)
   }, [])

   const rowClick = (e, cell) => {
      const orderId = cell._cell.row.data.oid.toString()
      setOrder(orderId, true)
   }

   if (listLoading) return <Loader />
   return (
      <>
         <Flex maxWidth="1280px" width="calc(100vw-64px)" margin="0 auto">
            {tab.data.isOccurencesClicked ? (
               <OrderComp />
            ) : (
               <>
                  <Flex
                     container
                     height="80px"
                     padding="16px"
                     alignItems="center"
                  >
                     <Text as="title">
                        Occurences(
                        {occurencesData?.subscriptionOccurencesAggregate
                           ?.occurenceCount?.count || 'N/A'}
                        )
                     </Text>
                     <Tooltip identifier="order_list_heading" />
                  </Flex>
                  <ReactTabulator
                     columns={columns}
                     data={occurences}
                     options={{
                        ...options,
                        placeholder: 'No Occurences Available Yet !',
                     }}
                     ref={tableRef}
                  />
               </>
            )}
         </Flex>
      </>
   )
}

export default SubscriptionTable
