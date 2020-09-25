import gql from 'graphql-tag'

export const APPS = {
   PERMISSIONS: gql`
      subscription roles(
         $email: String_comparison_exp!
         $title: String_comparison_exp!
      ) {
         roles(
            where: {
               users: { user: { email: $email } }
               apps: { app: { title: $title } }
            }
         ) {
            id
            title
            apps(where: { app: { title: $title } }) {
               id
               permissions(where: { value: { _eq: true } }) {
                  permission {
                     id
                     route
                     title
                  }
                  value
               }
            }
         }
      }
   `,
}
