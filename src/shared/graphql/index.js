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

export const OPERATION_CONFIG = gql`
   query MyQuery {
      settings_operationConfig {
         id
         stationId
         station {
            id
            name
         }
         labelTemplateId
         labelTemplate {
            id
            name
         }
      }
   }
`

export const STATIONS = gql`
   query MyQuery {
      stations {
         id
         name
      }
   }
`

export const LABELS = gql`
   query MyQuery {
      labelTemplates {
         id
         name
      }
   }
`

export const STATION = gql`
   query MyQuery($stationId: Int!) {
      station(id: $stationId) {
         name
      }
   }
`

export const LABEL_TEMPLATE = gql`
   query MyQuery($labelId: Int!) {
      labelTemplate(id: $labelId) {
         name
      }
   }
`

export const CREATE_OPERATION_CONFIG = gql`
   mutation MyMutation($object: settings_operationConfig_insert_input!) {
      insertOperationConfig: insert_settings_operationConfig_one(
         object: $object
      ) {
         id
         station {
            id
            name
         }
         labelTemplate {
            id
            name
         }
      }
   }
`

export const TOOLTIPS_BY_APP = gql`
   query app($title: String!) {
      app: dailyos_ux_app_by_pk(title: $title) {
         showTooltip
         tooltips {
            id
            link
            isActive
            identifier
            description
         }
      }
   }
`

export const GET_BANNER = gql`
   subscription ux_dailyosDivId($id: String!) {
      ux_dailyosDivId(where: { id: { _eq: $id } }) {
         fileId
         id
         isActive
         file {
            id
            fileType
            fileName
            path
            linkedCssFiles {
               id
               position
               cssFile {
                  fileName
                  fileType
                  path
               }
            }
            linkedJsFiles {
               id
               position
               jsFile {
                  fileName
                  fileType
                  path
               }
            }
         }
      }
   }
`
export const GET_BANNER_DATA = gql`
   subscription ux_dailyosDivId($id: String!, $params: jsonb!) {
      ux_dailyosDivId(where: { id: { _eq: $id }, isActive: { _eq: true } }) {
         id
         isActive
         dailyosDivIdFiles(where: { isActive: { _eq: true } }) {
            isActive
            condition {
               isValid(args: { params: $params })
            }
            divId
            file {
               id
               fileType
               fileName
               path
               linkedCssFiles {
                  id
                  position
                  cssFile {
                     fileName
                     fileType
                     path
                  }
               }
               linkedJsFiles {
                  id
                  position
                  jsFile {
                     fileName
                     fileType
                     path
                  }
               }
            }
         }
      }
   }
`

export const GET_BOTTOM_BAR_OPTIONS = gql`
   subscription GET_BOTTOM_BAR_OPTIONS($app: [String!]!) {
      ux_bottomBarOption(where: { app: { _in: $app } }) {
         title
         id
         app
         icon
         navigationMenuId
         navigationMenu {
            title
            id
            description
            navigationMenuItems {
               id
               label
               position
               parentNavigationMenuItemId
               url
               actionId
               action {
                  actionTypeTitle
                  dailyos_action
                  fileId
                  id
                  file {
                     id
                     fileName
                     fileType
                     path
                     linkedCssFiles {
                        id
                        position
                        cssFile {
                           fileName
                           fileType
                           path
                        }
                     }
                     linkedJsFiles {
                        id
                        position
                        jsFile {
                           fileName
                           fileType
                           path
                        }
                     }
                  }
               }
            }
         }
      }
   }
`
