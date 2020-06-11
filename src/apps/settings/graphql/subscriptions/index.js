import gql from 'graphql-tag'

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
         printer: attachedPrinters_aggregate {
            nodes {
               active
               printer {
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
      master_accompanimentType {
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
