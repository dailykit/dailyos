import gql from 'graphql-tag'

export const SAFETY_CHECKS = gql`
   {
      safety_safetyCheck {
         id
         created_at
         SafetyCheckPerUsers {
            id
         }
      }
   }
`
