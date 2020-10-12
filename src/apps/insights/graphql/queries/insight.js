import gql from 'graphql-tag'

export const GET_INSIGHT = gql`
   query GetInsight($identifier: String!) {
      insight(identifier: $identifier) {
         identifier
         availableOptions
         filters
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

export const INSIGHTS = gql`
   query insights {
      insights_insights(where: { isActive: { _eq: true } }) {
         identifier
      }
   }
`
