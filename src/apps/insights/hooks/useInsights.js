import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'

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
 * @param {{chart: boolean, table: boolean, switches: boolean, options: boolean}} [options]
 *
 * @returns {{loading: boolean, tableData: any[], switches: any, options: any, updateSwitches: () => {}, updateOptions: () => {}}} insight
 */
export const useInsights = (
   insightId,
   options = { chart: false, table: true, switches: true, options: true }
) => {
   const [variableSwitches, setVariableSwitches] = useState({})
   const [variableOptions, setVariableOptions] = useState({})

   const {
      data: {
         insight = { query: null, options: null, switches: null, id: null },
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

   // TODO: generate chart data if options.chart is true

   return {
      loading,
      tableData: transformedData,
      switches: variableSwitches,
      options: variableOptions,
      updateSwitches: setVariableSwitches,
      updateOptions: setVariableOptions,
   }
}
