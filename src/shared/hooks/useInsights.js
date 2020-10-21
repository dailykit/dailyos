import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react'
import { buildOptions, transformer } from '../utils/insight_utils'
import { merge } from 'lodash'

function onError(error) {
   console.log(error)
}

// prettier-ignore
const buildQuery = query => gql`${query}`

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
   identifier,
   options = {
      includeTableData: true,
   }
) => {
   const [variableSwitches, setVariableSwitches] = useState({})
   const [variableOptions, setVariableOptions] = useState({})
   const [isNewOption, setIsNewOption] = useState(false)
   const [newData, setNewData] = useState([])
   const [oldData, setOldData] = useState([])
   const [oldAggregates, setOldAggregates] = useState({})
   const [newAggregates, setNewAggregates] = useState({})
   const [oldTableData, setOldTableData] = useState([])
   const [newTableData, setNewTableData] = useState([])

   const {
      data: {
         insight = {
            query: null,
            availableOptions: null,
            switches: null,
            id: null,
            filters: null,
            defaultOptions: {},
            config: {},
         },
      } = {},
   } = useQuery(GET_INSIGHT, {
      onError,
      variables: {
         identifier,
      },
      onCompleted: data => {
         setVariableOptions(data.insight.defaultOptions || {})
         setVariableSwitches(data.insight.switches || {})
      },
   })

   if (insight && insight.query) {
      gqlQuery = buildQuery(insight.query)
   }

   const { loading } = useQuery(gqlQuery, {
      onError,
      variables: {
         ...variableSwitches,
         options: {
            ...insight.defaultOptions,
            ...merge(variableOptions, options.where),
         },
         limit: options.limit,
         orderBy: options.order,
      },
      onCompleted: data => {
         const nodeKey = Object.keys(data)[0]
         if (isNewOption) {
            setNewData(transformer(data, nodeKey))
            setNewAggregates(data[nodeKey].aggregate)
         } else {
            setOldData(transformer(data, nodeKey))
            setOldAggregates(data[nodeKey].aggregate)
         }
         if (options.includeTableData || options.includeChartData) {
            const tableData = transformer(data, nodeKey)

            if (isNewOption) {
               setNewTableData(tableData)
            } else {
               setOldTableData(tableData)
            }
         }
      },
   })

   const whereObject = buildOptions(insight.availableOptions || {})
   const filters = buildOptions(insight.filters || {})

   const updateOptions = isNewOption => {
      setIsNewOption(isNewOption)
      return setVariableOptions
   }

   const result = {
      loading,
      newTableData,
      oldTableData,
      switches: variableSwitches,
      optionVariables: variableOptions,
      options: whereObject,
      config: insight.config,
      updateSwitches: setVariableSwitches,
      updateOptions,
      oldAggregates,
      newAggregates,
      allowedCharts: insight.charts,
      filters,
      newData,
      oldData,
   }

   return result
}

export const GET_INSIGHT = gql`
   query GetInsight($identifier: String!) {
      insight(identifier: $identifier) {
         identifier
         availableOptions
         filters
         config
         defaultOptions
         query
         switches
         charts {
            id
            config
            layoutType
         }
      }
   }
`
