import gql from 'graphql-tag'

export const GET_INSIGHT = gql`
   query GetInsight($id: uuid!) {
      insight(id: $id) {
         id
         availableOptions
         defaultOptions
         query
         switches
         allowedCharts
      }
   }
`
export const INSIGHTS = gql`
   query Insights {
      insights_insights(where: { isActive: { _eq: true } }) {
         id
      }
   }
`
