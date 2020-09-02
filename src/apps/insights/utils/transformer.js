/**
 * @todo support for multiple queries in a request.
 * @body Adding this would enable to use multiple queries in a single request which can be helpfull in some cases, [see](https://hasura.io/docs/1.0/graphql/core/queries/multiple-queries.html). It is not super imoprtant for now.
 */

import { isObject } from '../../../shared/utils/isObject'

function flattenObject(object, prefix) {
   let result = {}
   Object.keys(object).forEach(key => {
      if (!isObject(object[key])) {
         result[`${prefix} ${key}`] = object[key]
      } else {
         const otherResults = flattenObject(object[key], `${prefix} ${key} `)
         result = { ...otherResults, ...result }
      }
   })

   return result
}

function flattenQuery(responseObject) {
   const results = []
   responseObject.nodes.forEach(node => {
      let result = {}
      if (isObject(node)) {
         Object.keys(node).forEach(key => {
            if (!isObject(node[key])) {
               result[key] = node[key]
            } else {
               const temp = flattenObject(node[key], '')

               result = { ...result, ...temp }
            }
         })

         results.push(result)
      }
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
export const transformer = (queryResponse, queryName) => {
   const responseObject = queryResponse[queryName]

   const result = flattenQuery(responseObject)

   return result
}
