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
 * @param {{chart?: {xKeys: Array<{key: string, label: string}>, xLabel: string}, includeTableData: boolean}} [options]
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

   if (options.chart && options.chart.xKeys && options.chart.xKeys.length) {
      const chartData = genChartData(options.chart, transformedData)

      result.chartData = chartData
   } else {
      result.chartData = null
   }

   return result
}

/**
 *
 * @param {{xKeys: Array<{key: string, action: {name: string, key: SUM | COUNT}}>, xLabels: string[]}} chartOptions
 */
function genChartData(chartOptions, transformedData) {
   const groupedData = groupBy(transformedData, chartOptions.xKeys[0]?.key)

   let chartData = [[]]

   // set chart header
   chartOptions.xKeys.forEach((key, idx) => {
      if (idx === 0) {
         chartData[0].push(chartOptions.xLabel, key)
      } else {
         chartData[0].push(key.action?.name)
      }
   })

   // fil chart data
   chartData.push(
      ...Object.keys(groupedData).map(key => {
         const result = [key]

         chartOptions.xKeys.forEach(option => {
            result.push(getChartValue(option, groupedData, key) || 0)
         })

         return result
      })
   )

   return chartData
}

function getChartValue(option, groupedData, key) {
   switch (option.action?.op) {
      case 'SUM':
         return groupedData[key].reduce(
            (acc, curr) => acc + curr[option.key],
            0
         )

      case 'COUNT':
         return groupedData[key]?.length

      default:
         return 0
   }
}
