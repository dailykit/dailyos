import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'
import { GET_INSIGHT } from '../graphql'
import { buildOptions, transformer } from '../utils/transformer'

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
 * @param {string} title
 * @param {{includeTableData: boolean, includeChartData: boolean}} [options]
 *
 * @returns {{loading: boolean, tableData: any[] | null, switches: any, optionVariables: any, options: any, updateSwitches: () => {}, updateOptions: () => {}, aggregates: {}} insight
 */
export const useInsights = (
   title,
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
            filters: null,
         },
      } = {},
   } = useQuery(GET_INSIGHT, {
      onError,
      variables: {
         title,
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

   if (options.includeTableData || options.includeChartData)
      transformedData = transformer(data, nodeKey)

   const whereObject = buildOptions(insight.availableOptions || {})
   const filters = buildOptions(insight.filters || {})

   const result = {
      loading,
      tableData: transformedData,
      switches: variableSwitches,
      optionVariables: variableOptions,
      options: whereObject,
      updateSwitches: setVariableSwitches,
      updateOptions: setVariableOptions,
      aggregates: data[nodeKey]?.aggregate,
      allowedCharts: insight.charts,
      filters,
   }

   return result
}
