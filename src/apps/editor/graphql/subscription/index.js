import gql from 'graphql-tag'

export const FILE_LINKS = gql`
   subscription FILE_LINKS($path: String!) {
      editor_file(where: { path: { _eq: $path } }) {
         fileId: id
         linkedCssFiles(order_by: { priority: desc_nulls_last }) {
            priority
            cssFile {
               path
               fileName
               fileType
               id
            }
         }
         linkedJsFiles {
            priority
            jsFile {
               path
               fileName
               fileType
               id
            }
         }
      }
   }
`

export const GET_FILES = gql`
   subscription GET_FILES($linkedCss: [Int!]!, $fileType: String!) {
      editor_file_aggregate(
         where: { id: { _nin: $linkedCss }, fileType: { _eq: $fileType } }
      ) {
         nodes {
            id
            fileName
            fileType
            path
         }
      }
   }
`
