/**
 * @todo support for multiple queries in a request.
 * @body Adding this would enable to use multiple queries in a single request which can be helpfull in some cases, [see](https://hasura.io/docs/1.0/graphql/core/queries/multiple-queries.html). It is not super important for now.
 */
import unflatten from 'unflatten'
import { isObject } from '../../../shared/utils/isObject'

export const buildOptions = (object, prefix = '') => {
   let result = {}

   if (Object.keys(object).some(key => key.startsWith('_'))) {
      const temp = prefix.trim()
      result[temp] = object
   } else
      Object.keys(object).forEach(key => {
         const tempKey = `${prefix} ${key}`.trim()
         if (!isObject(object[key])) {
            if (key !== '__typename') {
               result[tempKey] = object[key]
            }
         } else {
            const otherResults = buildOptions(object[key], `${prefix} ${key} `)
            result = { ...otherResults, ...result }
         }
      })

   return result
}

export const buildOptionVariables = data => {
   return unflatten(data, { separator: '  ' })
}

function flattenObject(object) {
   let result = {}
   Object.keys(object).forEach(key => {
      if (!isObject(object[key])) {
         if (key !== '__typename') {
            result[key] = object[key]
         }
      } else {
         const otherResults = flattenObject(object[key])
         result = { ...otherResults, ...result }
      }
   })

   return result
}

function flattenQuery(entities) {
   const results = []

   if (Array.isArray(entities))
      entities.forEach(node => {
         let result = {}
         if (!isObject(node)) {
            if (node !== '__typename') result[node] = node
         } else {
            const temp = flattenObject(node)
            result = { ...result, ...temp }
         }

         results.push(result)
      })

   return results
}

/**
 * Transforms the gql query response to use for tabulator data and chart data
 *
 * @param {string} queryResponse
 * @param {string} queryName
 * @returns {Array} flattened query response
 *
 * **Usage**
 *
 * ```js
 * transformer(query, 'queryName')
 * ```
 */
export const transformer = (queryResponse, nodeKey) => {
   const entities = queryResponse[nodeKey]

   const result = flattenQuery(entities)

   return result
}
