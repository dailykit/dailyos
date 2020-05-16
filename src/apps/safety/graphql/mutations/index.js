import gql from 'graphql-tag'

export const CREATE_SAFETY_CHECK = gql`
   mutation CreateSafetyCheck {
      insert_safety_safetyCheck(objects: {}) {
         returning {
            created_at
            id
         }
      }
   }
`
