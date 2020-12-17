import gql from 'graphql-tag'

export const GET_COMMIT = gql`
   query getCommit($path: String!, $id: String!) {
      getCommit(path: $path, id: $id) {
         message
         author {
            name
            email
         }
         committer {
            name
            email
            timestamp
         }
      }
   }
`
export const GET_COMMIT_CONTENT = `
query getCommitContent($path: String!, $id: String!) {
    getCommitContent(path: $path, id: $id)
}
`
export const GET_COMMITS = gql`
   query getCommits($path: String!, $commits: [String]!) {
      getCommits(path: $path, commits: $commits) {
         message
         author {
            name
         }
         committer {
            name
            timestamp
         }
      }
   }
`

export const GET_EXPLORER_CONTENT = gql`
   query getFolderWithFiles($path: String!) {
      getFolderWithFiles(path: $path) {
         name
         path
         type
         children {
            name
            path
            type
            children {
               name
               path
               type
               children {
                  name
                  path
                  type
                  children {
                     name
                     path
                     type
                     children {
                        name
                        path
                        type
                        children {
                           name
                           path
                           type
                           children {
                              name
                              path
                              type
                              children {
                                 name
                                 path
                                 type
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }
`
export const GET_FILE = gql`
   query GET_FILE($path: String!) {
      editor_file(where: { path: { _eq: $path } }) {
         fileName
         fileType
         id
      }
   }
`
export const GET_FILE_FETCH = `
query getFile($path: String!) {
    getFile(path: $path) {
        size
        name
        createdAt
        content
        path			
    }
}
`
export const SEARCH_FILES = gql`
   query searchFiles($fileName: String!) {
      searchFiles(fileName: $fileName)
   }
`
export const UPDATE_FILE = gql`
   mutation updateFile($path: String!, $content: String!, $message: String!) {
      updateFile(path: $path, content: $content, message: $message) {
         ... on Error {
            success
            error
         }
         ... on Success {
            success
            message
         }
      }
   }
`

// export const GET_FILES = gql`
//    query GET_FILES($fileType: String!) {
//       editor_file_aggregate(where: { fileType: { _eq: $fileType } }) {
//          nodes {
//             fileName
//             fileType
//             id
//             path
//             lastSaved
//          }
//       }
//    }
// `
// export const FILE_LINKS = gql`
//    query FILE_LINKS($path: String!) {
//       editor_file(where: { path: { _eq: $path } }) {
//          fileId: id
//          linkedCssFiles {
//             priority
//             cssFile {
//                path
//                fileName
//                fileType
//                id
//             }
//          }
//          linkedJsFiles {
//             priority
//             jsFile {
//                path
//                fileName
//                fileType
//                id
//             }
//          }
//       }
//    }
// `
