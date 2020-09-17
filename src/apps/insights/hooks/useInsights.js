import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'
import { groupBy } from 'lodash'

import { GET_INSIGHT } from '../graphql'
import { transformer, buildOptions } from '../utils/transformer'

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
 * @param {string} nodeKey
 * @param {{chart?: {chartTypeIndex: number}, includeTableData: boolean, includeChart: boolean, xColumn?: string, yColumn?: string}} [options]
 *
 * @returns {{loading: boolean, tableData: any[] | null, chartData: any | null, switches: any, optionVariables: any, options: any, allowedCharts: string[], updateSwitches: () => {}, updateOptions: () => {}}} insight
 */
export const useInsights = (
   insightId,
   nodeKey,
   options = {
      chart: {},
      includeTableData: true,
   }
) => {
   const [variableSwitches, setVariableSwitches] = useState({})
   const [variableOptions, setVariableOptions] = useState({})

   const {
      data: {
         insight = {
            query: null,
            options: null,
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
         setVariableOptions(data.insight.options)
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

   if (options.includeTableData || options.chart)
      transformedData = transformer(data, nodeKey)

   const whereObject = buildOptions(insight.options || {})

   const result = {
      loading,
      tableData: transformedData,
      switches: variableSwitches,
      optionVariables: variableOptions,
      options: whereObject,
      updateSwitches: setVariableSwitches,
      updateOptions: setVariableOptions,
      allowedCharts: insight.allowedCharts,
   }

   if (options.includeChart && insight.allowedCharts) {
      const chartData = genChartData(insight.allowedCharts, transformedData, {
         chartTypeIndex: 0,
         xColumn: options.xColumn,
         yColumns: options.yColumns,
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
 * @param {{chartTypeIndex: number, xColumn: string, yColumns: any[]}} option
 */
function genChartData(
   allowedCharts,
   transformedData,
   { chartTypeIndex, xColumn, yColumns }
) {
   let chartData = [[]]

   // add chart header
   if (
      Array.isArray(allowedCharts) &&
      allowedCharts.length &&
      allowedCharts[chartTypeIndex] &&
      allowedCharts[chartTypeIndex].x
   ) {
      if (xColumn) {
         const index = allowedCharts[chartTypeIndex].x.findIndex(
            col => col.key === xColumn
         )

         if (index >= 0)
            chartData[0].push(allowedCharts[chartTypeIndex].x[index])
      } else {
         // push the first column from x in header
         chartData[0].push(allowedCharts[chartTypeIndex].x[0])
      }
   }

   if (yColumns.length) {
      yColumns.forEach(column => {
         chartData[0].push(column)
      })
   } else {
      if (
         Array.isArray(allowedCharts) &&
         allowedCharts[chartTypeIndex] &&
         allowedCharts[chartTypeIndex].y
      )
         chartData[0].push(allowedCharts[chartTypeIndex].y[0])
   }

   // add chart data

   transformedData.forEach(data => {
      const row = []

      chartData[0].forEach(label => {
         row.push(data[label.key])
      })

      chartData.push(row)
   })

   return chartData
}
