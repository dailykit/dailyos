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

export const SAFETY_CHECK = gql`
   subscription SafetyCheck($id: Int!) {
      safety_safetyCheck(where: { id: { _eq: $id } }) {
         id
         created_at
         SafetyCheckPerUsers {
            id
         }
      }
   }
`
