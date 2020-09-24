import gql from 'graphql-tag'

export const LABEL_PRINTERS = gql`
   subscription labelPrinters($type: String!, $stationId: Int!) {
      labelPrinters: printers(
         where: {
            printerType: { _eq: $type }
            _not: {
               attachedStations_label: { station: { id: { _eq: $stationId } } }
            }
         }
      ) {
         printNodeId
         name
         computer {
            name
            hostname
         }
      }
   }
`

export const UNASSIGNED_SCALES = gql`
   subscription scales {
      scales(where: { stationId: { _is_null: true } }) {
         deviceNum
         deviceName
         computer {
            name
            hostname
            printNodeId
         }
      }
   }
`

export const KOT_PRINTERS = gql`
   subscription kotPrinters($type: String!, $stationId: Int!) {
      kotPrinters: printers(
         where: {
            printerType: { _eq: $type }
            _not: {
               attachedStations_label: { station: { id: { _eq: $stationId } } }
            }
         }
      ) {
         printNodeId
         name
         computer {
            name
            hostname
         }
      }
   }
`

export const STATIONS_AGGREGATE = gql`
   subscription stationsAggregate {
      stationsAggregate {
         aggregate {
            count
         }
      }
   }
`
export const USERS_AGGREGATE = gql`
   subscription settings_user_aggregate {
      settings_user_aggregate {
         aggregate {
            count
         }
      }
   }
`

export const USER_BY_STATION = gql`
   subscription settings_user($_eq: Int!) {
      settings_user(
         where: {
            _not: { assignedStations: { station: { id: { _eq: $_eq } } } }
         }
      ) {
         id
         lastName
         firstName
         keycloakId
      }
   }
`

export const STATION = gql`
   subscription station($id: Int!) {
      station(id: $id) {
         id
         name
         defaultKotPrinterId
         defaultLabelPrinterId
         scale: assignedScales_aggregate {
            aggregate {
               count
            }
            nodes {
               active
               deviceNum
               deviceName
               computer {
                  name
                  hostname
                  printNodeId
               }
            }
         }
         labelPrinter: attachedLabelPrinters_aggregate {
            nodes {
               active
               labelPrinter {
                  name
                  state
                  printNodeId
               }
            }
            aggregate {
               count
            }
         }
         kotPrinter: attachedKotPrinters_aggregate {
            nodes {
               active
               kotPrinter {
                  name
                  state
                  printNodeId
               }
            }
            aggregate {
               count
            }
         }
         user: assignedUsers_aggregate {
            nodes {
               active
               user {
                  id
                  firstName
                  lastName
                  keycloakId
               }
            }
            aggregate {
               count
            }
         }
      }
   }
`

export const STATIONS = gql`
   subscription stations {
      stations {
         id
         name
      }
   }
`

export const USERS = gql`
   subscription settings_user {
      settings_user {
         id
         firstName
         lastName
         email
         phoneNo
      }
   }
`

export const USER = gql`
   subscription settings_user_by_pk($id: Int!) {
      settings_user_by_pk(id: $id) {
         id
         firstName
         lastName
         email
         phoneNo
         tempPassword
         keycloakId
      }
   }
`

export const PROCESSINGS = gql`
   subscription Processings {
      masterProcessings {
         id
         name
         ingredientProcessings {
            id
         }
      }
   }
`

export const CUISINES = gql`
   subscription Cuisines {
      cuisineNames {
         id
         name
         simpleRecipes {
            id
         }
      }
   }
`

export const ACCOMPANIMENT_TYPES = gql`
   subscription AccompanimentTypes {
      accompaniments {
         id
         name
      }
   }
`

export const ALLERGENS = gql`
   subscription Allergens {
      masterAllergens {
         id
         name
         description
      }
   }
`

export const UNITS_COUNT = gql`
   subscription UnitsCount {
      unitsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const UNITS = gql`
   subscription Units {
      units {
         id
         name
      }
   }
`

export const DEVICES = gql`
   subscription computers {
      computers {
         name
         state
         hostname
         created_at
         updated_at
         printNodeId
         activePrinters: printers_aggregate(
            where: { state: { _eq: "online" } }
         ) {
            aggregate {
               count
            }
         }
         totalPrinters: printers_aggregate {
            aggregate {
               count
            }
         }
         printers {
            name
            state
            printNodeId
            computer {
               name
            }
         }
         scales {
            deviceNum
            deviceName
            computer {
               name
            }
         }
      }
   }
`

export const ROLES = {
   AGGREGATE: gql`
      subscription rolesAggregate {
         rolesAggregate {
            aggregate {
               count
            }
         }
      }
   `,
   ROLE: gql`
      subscription role($id: Int!) {
         role(id: $id) {
            id
            title
            apps {
               id
               app {
                  id
                  title
               }
            }
            users {
               user {
                  id
                  email
                  lastName
                  firstName
                  keycloakId
               }
            }
         }
      }
   `,
   LIST: gql`
      subscription roles {
         roles {
            id
            title
            apps {
               id
               app {
                  id
                  title
               }
            }
         }
      }
   `,
   APPS: gql`
      query apps($roleId: Int_comparison_exp!) {
         apps(where: { _not: { roles: { roleId: $roleId } } }) {
            id
            title
         }
      }
   `,
   INSERT_ROLES_APPS: gql`
      mutation insert_settings_role_app(
         $objects: [settings_role_app_insert_input!]!
      ) {
         insert_settings_role_app(objects: $objects) {
            affected_rows
         }
      }
   `,
   INSERT_ROLES_USERS: gql`
      mutation insert_settings_user_role(
         $objects: [settings_user_role_insert_input!]!
      ) {
         insert_settings_user_role(objects: $objects) {
            affected_rows
         }
      }
   `,
   USERS: gql`
      query users($roleId: Int_comparison_exp!) {
         users: settings_user(where: { _not: { roles: { roleId: $roleId } } }) {
            id
            email
            lastName
            firstName
            keycloakId
         }
      }
   `,
   ROLE_APP: gql`
      query role_app($appId: Int!, $roleId: Int!) {
         role_app: settings_role_app_by_pk(appId: $appId, roleId: $roleId) {
            id
         }
      }
   `,
   PERMISSIONS: gql`
      subscription permissions(
         $appId: Int_comparison_exp!
         $roleId: Int_comparison_exp!
      ) {
         permissions: settings_appPermission(where: { appId: $appId }) {
            id
            route
            title
            roleAppPermissions: role_appPermissions(
               where: { role_app: { appId: $appId, roleId: $roleId } }
            ) {
               value
            }
         }
      }
   `,
   UPDATE_PERMISSION: gql`
      mutation updateRole_AppPermission(
         $appPermissionId: Int_comparison_exp!
         $value: Boolean!
      ) {
         updateRole_AppPermission: update_settings_role_appPermission(
            where: { appPermissionId: $appPermissionId }
            _set: { value: $value }
         ) {
            affected_rows
         }
      }
   `,
   INSERT_PERMISSION: gql`
      mutation insertRole_AppPermission(
         $object: settings_role_appPermission_insert_input!
      ) {
         insertRole_AppPermission: insert_settings_role_appPermission_one(
            object: $object
         ) {
            role_appId
         }
      }
   `,
}

export const PRINTNODE_CREDS = gql`
   query admins {
      admins: organizationAdmins {
         email
         password: printNodePassword
      }
   }
`

export const APPS = gql`
   subscription apps {
      apps {
         id
         title
         roles {
            id
            role {
               id
               title
            }
         }
      }
   }
`
