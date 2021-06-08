import React from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import {
   Loader,
   Flex,
   Dropdown,
   Spacer,
   TextButton,
   ButtonGroup,
   Text,
} from '@dailykit/ui'
import moment from 'moment'
import './tableStyle.css'
import options from './tableOptions'
import { Tooltip } from '../../components'
import { useTooltip, TooltipProvider } from '../../providers'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { SUBSCRIPTION_VIEW_FULL_OCCURENCE_REPORT } from './graphql'
const FullOccurrenceReport = () => {
   const [reports, setReports] = React.useState([])
   const tableRef = React.useRef()
   // const { tooltip } = useTooltip()
   const groupByOptions = [
      { id: 1, title: 'Paused', payLoad: 'isPaused' },
      { id: 2, title: 'Skipped', payLoad: 'isSkipped' },
      { id: 3, title: 'Payment Status', payLoad: 'paymentStatus' },
      { id: 4, title: 'Title', payLoad: 'title' },
      { id: 5, title: 'Serving Size', payLoad: 'subscriptionServingSize' },
      { id: 6, title: 'Item Count', payLoad: 'subscriptionItemCount' },
   ]
   //query
   // const { loading: queryLoading, error: queryError } = useQuery(
   //    SUBSCRIPTION_VIEW_FULL_OCCURENCE_REPORT,
   //    {
   //       onCompleted: data => {
   //          console.log(data)
   //          setReports(data.subscription_view_full_occurence_report)
   //       },
   //       onError: error => {
   //          console.log(error)
   //       },
   //    }
   // )
   React.useEffect(() => {
      // `${process.env.REACT_APP_DAILYOS_SERVER_URI/api/getfulloccurence/getfulloccurence}`
      fetch(
         `${process.env.REACT_APP_DAILYOS_SERVER_URI}/api/getfulloccurence/getfulloccurence`
      )
         .then(result => result.json())
         .then(data => {
            console.log('this is data', data)
            setReports(data.data)
         })
   }, [])
   const columns = [
      {
         title: 'Brand CustomerId',
         field: 'brand_customerId',
         width: 200,
         headerFilter: true,
         frozen: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_brand_customerId_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Cart Id',
         field: 'cartId',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier = 'subscription_full_cart_id_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Cut Off Time',
         field: 'cutoffTimeStamp',
         width: 200,
         headerFilter: true,
         formatter: reactFormatter(<CutoffTimeStampFormatter />),
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_cutoff_time_stamp_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Fulfillment Date',
         field: 'fulfillmentDate',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_fulfillment_date_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'All Time Rank',
         field: 'allTimeRank',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_all_time_rank_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Sub. Occurence Id',
         field: 'subscriptionOccurenceId',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_subscription_occurrence_id_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Sub. Item Count',
         field: 'subscriptionItemCount',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_subscription_occurrence_id_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Sub. Serving Size',
         field: 'subscriptionServingSize',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_subscription_occurrence_id_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Title',
         field: 'title',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_subscription_occurrence_id_column'
            return column.getDefinition().title
         },
      },
      {
         title: '# Products In Cart',
         field: 'addedProductsCount',
         headerFilter: 'number',
         headerFilterPlaceholder: 'Equal to',
         headerFilterFunc: '=',
         width: 200,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_#_products_in_cart_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Item Count Valid',
         field: 'isItemCountValid',
         width: 200,
         headerFilter: 'true',
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_item_count_valid_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Between Paused',
         field: 'betweenPause',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_between_pause_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Paused',
         field: 'isPaused',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier = 'subscription_full_occurrence_pause_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Skipped',
         field: 'isSkipped',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier = 'subscription_full_occurrence_is_skipped_column'
            return column.getDefinition().title
         },
      },
      {
         title: '% Skipped',
         field: 'percentageSkipped',
         width: 200,
         headerFilter: true,
         formatter: reactFormatter(<SkippedFormatter />),

         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_percentage_skipped_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Skipped Stage',
         field: 'skippedAtThisStage',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_skipped_at_this_stage_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Discount',
         field: 'discount',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_payment_retry_attempt_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Payment Retry Attempt',
         field: 'paymentRetryAttempt',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_payment_retry_attempt_column'
            return column.getDefinition().title
         },
      },
      {
         title: 'Payment Status',
         field: 'paymentStatus',
         width: 200,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier =
               'subscription_full_occurrence_payment_status_column'
            return column.getDefinition().title
         },
      },
   ]
   const clearHeaderFilter = () => {
      tableRef.current.table.clearHeaderFilter()
   }
   const defaultIDS = () => {
      let arr = []
      const occurrenceGroup = localStorage.getItem(
         'tabulator-full_occurrence_table-group'
      )
      const occurrenceGroupParse =
         occurrenceGroup !== undefined &&
         occurrenceGroup !== null &&
         occurrenceGroup.length !== 0
            ? JSON.parse(occurrenceGroup)
            : null
      if (occurrenceGroupParse !== null) {
         occurrenceGroupParse.forEach(x => {
            const foundGroup = groupByOptions.find(y => y.payLoad == x)
            arr.push(foundGroup.id)
         })
      }
      console.log('this is arr', arr)
      return arr.length == 0 ? [] : arr
   }
   const downloadCsvData = () => {
      tableRef.current.table.download(
         'csv',
         'full_subscription_occurrence_table.csv'
      )
   }

   const downloadPdfData = () => {
      tableRef.current.table.downloadToTab(
         'pdf',
         'full_subscription_occurrence_table.pdf'
      )
   }

   const downloadXlsxData = () => {
      tableRef.current.table.download(
         'xlsx',
         'full_subscription_occurrence_table.xlsx'
      )
   }
   const tableLoaded = () => {
      const occurrenceGroup = localStorage.getItem(
         'tabulator-full_occurrence_table-group'
      )
      const occurrenceGroupParse =
         occurrenceGroup !== undefined &&
         occurrenceGroup !== null &&
         occurrenceGroup.length !== 0
            ? JSON.parse(occurrenceGroup)
            : null
      console.log('this is uccurrnec', occurrenceGroupParse)
      tableRef.current.table.setGroupBy(
         !!occurrenceGroupParse && occurrenceGroupParse.length > 0
            ? ['fulfillmentDate', ...occurrenceGroupParse]
            : 'fulfillmentDate'
      )
      tableRef.current.table.setGroupHeader(function (
         value,
         count,
         data1,
         group
      ) {
         // let [totalOrders, totalPaid] = [0, 0]
         // const foo = (group, col) => {
         //    let total = 0
         //    if (group.groupList.length != 0) {
         //       group.groupList.forEach(each => (total += foo(each, col)))
         //    } else {
         //       group.rows.forEach(row => (total += row.data[col]))
         //    }
         //    return total
         // }
         // totalOrders = foo(group._group, 'orders')
         // totalPaid = foo(group._group, 'paid')
         // const avg = parseFloat(totalPaid / totalOrders).toFixed(2)
         let newHeader
         switch (group._group.field) {
            case 'paymentStatus':
               newHeader = 'Payment Status'
               break
            case 'isPaused':
               newHeader = 'Paused'
               break
            case 'isSkipped':
               newHeader = 'Skipped'
               break
            case 'fulfillmentDate':
               newHeader = 'Fulfillment Date'
               break

            case 'title':
               newHeader = 'Title'
               break

            case 'subscriptionServingSize':
               newHeader = 'Serving Size'
               break

            case 'subscriptionItemCount':
               newHeader = 'Item Count'
               break

            default:
               break
         }
         return `${newHeader} - ${value} || ${count} Customers `
      })
   }

   if (reports.length == 0) return <Loader />

   return (
      <>
         <TooltipProvider>
            <Flex padding="0px 42px 21px 42px">
               <Flex
                  container
                  height="80px"
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Flex container>
                     <Text as="title">Subscription Report</Text>
                     <Tooltip identifier="customer_list_heading" />
                  </Flex>
                  <Flex container alignItems="center">
                     <Text as="text1">Group By:</Text>
                     <Spacer size="5px" xAxis />
                     <Dropdown
                        type="multi"
                        variant="revamp"
                        disabled={true}
                        defaultIds={defaultIDS()}
                        options={groupByOptions}
                        searchedOption={() => {}}
                        selectedOption={value => {
                           localStorage.setItem(
                              'tabulator-full_occurrence_table-group',
                              JSON.stringify(value.map(x => x.payLoad))
                           )
                           tableRef.current.table.setGroupBy([
                              'fulfillmentDate',
                              ...value.map(x => x.payLoad),
                           ])
                        }}
                        typeName="groupBy"
                     />
                     <ButtonGroup align="left">
                        <TextButton
                           type="ghost"
                           size="sm"
                           onClick={() => clearHeaderFilter()}
                        >
                           Clear All Filter
                        </TextButton>
                     </ButtonGroup>
                     <Flex
                        margin="10px 0"
                        container
                        alignItems="center"
                        justifyContent="space-between"
                     >
                        <TextButton
                           onClick={downloadCsvData}
                           type="solid"
                           size="sm"
                        >
                           CSV
                        </TextButton>
                        <Spacer size="10px" xAxis />
                        <TextButton
                           onClick={downloadPdfData}
                           type="solid"
                           size="sm"
                        >
                           PDF
                        </TextButton>
                        <Spacer size="10px" xAxis />
                        <TextButton
                           onClick={downloadXlsxData}
                           type="solid"
                           size="sm"
                        >
                           XLSX
                        </TextButton>
                     </Flex>
                  </Flex>
               </Flex>
               <Spacer size="30px" />
               <ReactTabulator
                  columns={columns}
                  className="custom-css-class"
                  data={reports}
                  dataLoaded={tableLoaded}
                  data-custom-attr="test-custom-attribute"
                  options={options}
                  ref={tableRef}
               />
            </Flex>
         </TooltipProvider>
      </>
   )
}
const CutoffTimeStampFormatter = ({ cell }) => {
   return (
      <>
         <Text as="text2">
            {moment(cell._cell.value).format('MMMM Do YYYY, h:mm a')}
         </Text>
      </>
   )
}
const SkippedFormatter = ({ cell }) => {
   console.log('this is skipped', parseFloat(cell._cell.value).toFixed(2))
   console.log('this is skipped', cell)
   return (
      <>
         <Text as="text2">{parseFloat(cell._cell.value).toFixed(2)}</Text>
      </>
   )
}
export default FullOccurrenceReport
