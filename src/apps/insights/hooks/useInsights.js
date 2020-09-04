import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'
import { groupBy } from 'lodash'

import { GET_INSIGHT } from '../graphql'
import { transformer } from '../utils/transformer'

function onError(error) {
   console.log(error)
}

// prettier-ignore
const buildQuery = query => gql`${query}`

let transformedData = []

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
 * @param {{chart?: {type: 'bar' | 'pie', x: string, name: string}, table: boolean, switches: boolean, options: boolean}} [options]
 *
 * @returns {{loading: boolean, tableData: any[], chartData: any, switches: any, options: any, allowedCharts: string[], updateSwitches: () => {}, updateOptions: () => {}}} insight
 */
export const useInsights = (
   insightId,
   options = {
      chart: {},
      table: true,
      switches: true,
      options: true,
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
         ...variableOptions,
      },
   })

   const queryName = Object.keys(data)[0]

   transformedData = transformer(data, queryName)

   const result = {
      loading,
      tableData: transformedData,
      switches: variableSwitches,
      options: variableOptions,
      updateSwitches: setVariableSwitches,
      updateOptions: setVariableOptions,
      allowedCharts: insight.allowedCharts,
   }

   if (options.chart && options.chart.x) {
      const groupedData = groupBy(transformedData, options.chart.x)

      const chartData = {
         labels: Object.keys(groupedData),
         datasets: [
            {
               label: options.chart.name,
               data: Object.values(groupedData).map(data => data.length),
            },
         ],
      }

      result.chartData = chartData
   }

   return result
}
