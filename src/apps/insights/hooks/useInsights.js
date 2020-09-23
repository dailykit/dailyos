import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'

import { GET_INSIGHT } from '../graphql'
import { transformer, buildOptions } from '../utils/transformer'
import { generateBarChartData } from '../utils/generateBarChartData'
import { generatePieChartData } from '../utils/generatePieChartData'
import { generateCalendarChartData } from '../utils/generateCalendarChartData'

function onError(error) {
   console.log(error)
}

// prettier-ignore
const buildQuery = query => gql`${query}`

let transformedData = null

let gqlQuery = {
   kind: 'Document',
   definitions: [
      {
         kind: 'OperationDefinition',
         operation: 'query',
         name: null,
         variableDefinitions: null,
         directives: [],
         selectionSet: {
            kind: 'SelectionSet',
            selections: [
               {
                  kind: 'Field',
                  alias: null,
                  name: {
                     kind: 'Name',
                     value: 'user',
                  },
               },
            ],
         },
      },
   ],
}

/**
 *
 * @param {string} insightId
 * @param {{chartType: {index: number, multiple: boolean, type: string}, includeTableData: boolean, includeChart: boolean, xColumn?: string, yColumns?: any[], slice: string, metrices: any[]}} [options]
 *
 * @returns {{loading: boolean, tableData: any[] | null, chartData: any | null, switches: any, optionVariables: any, options: any, allowedCharts: any[], updateSwitches: () => {}, updateOptions: () => {}, aggregates: {}} insight
 */
export const useInsights = (
   insightId,
   options = {
      includeTableData: true,
   }
) => {
   const [variableSwitches, setVariableSwitches] = useState({})
   const [variableOptions, setVariableOptions] = useState({})

   const {
      data: {
         insight = {
            query: null,
            availableOptions: null,
            switches: null,
            id: null,
            allowedCharts: [],
         },
      } = {},
   } = useQuery(GET_INSIGHT, {
      onError,
      variables: {
         id: insightId,
      },
      onCompleted: data => {
         setVariableOptions(data.insight.defaultOptions)
         setVariableSwitches(data.insight.switches)
      },
   })

   if (insight && insight.query) {
      gqlQuery = buildQuery(insight.query)
   }

   const { data = {}, loading } = useQuery(gqlQuery, {
      onError,
      variables: {
         ...variableSwitches,
         options: variableOptions,
      },
   })

   const nodeKey = Object.keys(data)[0]

   if (options.includeTableData || options.chart)
      transformedData = transformer(data, nodeKey)

   const whereObject = buildOptions(insight.availableOptions || {})

   const result = {
      loading,
      tableData: transformedData,
      switches: variableSwitches,
      optionVariables: variableOptions,
      options: whereObject,
      updateSwitches: setVariableSwitches,
      updateOptions: setVariableOptions,
      allowedCharts: insight.allowedCharts,
      aggregates: data[nodeKey]?.aggregate,
   }

   if (options.includeChart && insight.allowedCharts) {
      const chartData = genChartData(insight.allowedCharts, transformedData, {
         xColumn: options.xColumn,
         yColumns: options.yColumns,
         chartType: options.chartType,
         slice: options.slice,
         metrices: options.metrices,
         // TODO: add dateKeys from options here
         dateKeys: [],
      })
      result.chartData = chartData
   } else {
      result.chartData = null
   }

   return result
}

/**
 *
 * @param {Array<{type: string, columns: any[]}>} allowedCharts
 * @param {any[]} transformedData
 * @param {{chartTypeIndex: number, xColumn: string, yColumns: any[], chartType: {multiple: boolean, type: string, index: number}, slice: string, metrices: Array<{key: string, label: string}>, dateKeys: string[]}} option
 */
function genChartData(
   allowedCharts,
   transformedData,
   { xColumn, yColumns, chartType, slice, metrices, dateKeys }
) {
   let chartData = []

   switch (chartType.type) {
      case 'Bar':
         chartData = generateBarChartData(allowedCharts, transformedData, {
            xColumn,
            yColumns,
            chartTypeIndex: chartType.index,
         })
         return chartData

      case 'PieChart':
         chartData = generatePieChartData(allowedCharts, transformedData, {
            chartTypeIndex: chartType.index,
            slice,
            metrices,
         })

         return chartData

      case 'Calendar':
         chartData = generateCalendarChartData(allowedCharts, transformedData, {
            chartTypeIndex: chartType.index,
            metrices,
            dateKeys,
         })
         return chartData

      default:
         chartData = generateBarChartData(allowedCharts, transformedData, {
            chartTypeIndex: chartType.index,
            xColumn,
            yColumns,
         })
         return chartData
   }
}
