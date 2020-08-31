import gql from 'graphql-tag'

export const REMOVE_SCALE_STATION = gql`
   mutation updateScale(
      $deviceNum: Int!
      $deviceName: String!
      $computerId: Int!
   ) {
      updateScale(
         pk_columns: {
            computerId: $computerId
            deviceName: $deviceName
            deviceNum: $deviceNum
         }
         _set: { stationId: null }
      ) {
         deviceNum
      }
   }
`

export const ADD_STATION_TO_SCALE = gql`
   mutation updateScales(
      $computerId: Int!
      $deviceName: String!
      $deviceNum: Int!
      $stationId: Int!
   ) {
      updateScales(
         where: {
            deviceNum: { _eq: $deviceNum }
            deviceName: { _eq: $deviceName }
            computerId: { _eq: $computerId }
         }
         _set: { stationId: $stationId }
      ) {
         returning {
            deviceNum
            deviceName
         }
      }
   }
`

export const UPDATE_SCALE_STATUS = gql`
   mutation updateScale(
      $deviceNum: Int!
      $deviceName: String!
      $computerId: Int!
      $active: Boolean!
   ) {
      updateScale(
         pk_columns: {
            computerId: $computerId
            deviceName: $deviceName
            deviceNum: $deviceNum
         }
         _set: { active: $active }
      ) {
         deviceNum
         deviceName
      }
   }
`

export const UPDATE_STATION_DEFAULT_LABEL_PRINTER = gql`
   mutation updateStation($id: Int!, $defaultLabelPrinterId: Int!) {
      updateStation(
         pk_columns: { id: $id }
         _set: { defaultLabelPrinterId: $defaultLabelPrinterId }
      ) {
         id
      }
   }
`

export const UPDATE_STATION_DEFAULT_KOT_PRINTER = gql`
   mutation updateStation($id: Int!, $defaultKotPrinterId: Int!) {
      updateStation(
         pk_columns: { id: $id }
         _set: { defaultKotPrinterId: $defaultKotPrinterId }
      ) {
         id
      }
   }
`

export const CREATE_STATION_LABEL_PRINTER = gql`
   mutation insert_settings_station_label_printer(
      $objects: [settings_station_label_printer_insert_input!]!
   ) {
      insert_settings_station_label_printer(objects: $objects) {
         returning {
            stationId
            printNodeId
         }
      }
   }
`

export const CREATE_STATION_KOT_PRINTER = gql`
   mutation insert_settings_station_kot_printer(
      $objects: [settings_station_kot_printer_insert_input!]!
   ) {
      insert_settings_station_kot_printer(objects: $objects) {
         returning {
            stationId
            printNodeId
         }
      }
   }
`

export const DELETE_STATION_LABEL_PRINTER = gql`
   mutation deleteStationLabelPrinter($stationId: Int!, $printNodeId: Int!) {
      deleteStationLabelPrinter: delete_settings_station_label_printer_by_pk(
         printNodeId: $printNodeId
         stationId: $stationId
      ) {
         stationId
         printNodeId
      }
   }
`

export const DELETE_STATION_KOT_PRINTER = gql`
   mutation deleteStationKotPrinter($stationId: Int!, $printNodeId: Int!) {
      deleteStationKotPrinter: delete_settings_station_kot_printer_by_pk(
         printNodeId: $printNodeId
         stationId: $stationId
      ) {
         stationId
         printNodeId
      }
   }
`

export const UPDATE_STATION_LABEL_PRINTER = gql`
   mutation updateStationLabelPrinter(
      $printNodeId: Int!
      $stationId: Int!
      $active: Boolean!
   ) {
      updateStationLabelPrinter: update_settings_station_label_printer_by_pk(
         pk_columns: { printNodeId: $printNodeId, stationId: $stationId }
         _set: { active: $active }
      ) {
         stationId
      }
   }
`

export const UPDATE_STATION_KOT_PRINTER = gql`
   mutation updateStationKotPrinter(
      $printNodeId: Int!
      $stationId: Int!
      $active: Boolean!
   ) {
      updateStationKotPrinter: update_settings_station_kot_printer_by_pk(
         pk_columns: { printNodeId: $printNodeId, stationId: $stationId }
         _set: { active: $active }
      ) {
         stationId
      }
   }
`

export const UPDATE_STATION_USER_STATUS = gql`
   mutation updateStation_user(
      $stationId: Int!
      $userKeycloakId: String!
      $active: Boolean!
   ) {
      updateStation_user(
         pk_columns: { stationId: $stationId, userKeycloakId: $userKeycloakId }
         _set: { active: $active }
      ) {
         stationId
         userKeycloakId
      }
   }
`

export const DELETE_STATION_USER = gql`
   mutation deleteStation_user($stationId: Int!, $userKeycloakId: String!) {
      deleteStation_user(
         stationId: $stationId
         userKeycloakId: $userKeycloakId
      ) {
         stationId
         userKeycloakId
      }
   }
`

export const CREATE_STATION_USERS = gql`
   mutation createStation_users(
      $objects: [settings_station_user_insert_input!]!
   ) {
      createStation_users(objects: $objects) {
         returning {
            stationId
            userKeycloakId
         }
      }
   }
`

export const UPSERT_STATION = gql`
   mutation insertStation($object: settings_station_insert_input!) {
      insertStation(
         object: $object
         on_conflict: { constraint: station_pkey, update_columns: [name] }
      ) {
         id
         name
      }
   }
`

export const DELETE_STATION = gql`
   mutation updateStation($id: Int!) {
      deleteStation(id: $id) {
         id
         name
      }
   }
`

export const CREATE_USER = gql`
   mutation insert_settings_user_one($object: settings_user_insert_input!) {
      insert_settings_user_one(object: $object) {
         id
      }
   }
`

export const DELETE_USER = gql`
   mutation delete_settings_user_by_pk($id: Int!) {
      delete_settings_user_by_pk(id: $id) {
         id
      }
   }
`

export const CREATE_ACCOMPANIMENT_TYPES = gql`
   mutation CreateAccompanimentTypes(
      $objects: [master_accompanimentType_insert_input!]!
   ) {
      insert_master_accompanimentType(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_ACCOMPANIMENT_TYPES = gql`
   mutation DeleteAccompanimentTypes($ids: [Int!]!) {
      delete_master_accompanimentType(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_PROCESSINGS = gql`
   mutation CreateProcessings(
      $objects: [master_processingName_insert_input!]!
   ) {
      createMasterProcessing(objects: $objects) {
         returning {
            id
            name
            description
         }
      }
   }
`

export const DELETE_PROCESSINGS = gql`
   mutation DeleteProcessings($ids: [Int!]!) {
      deleteMasterProcessing(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_CUISINES = gql`
   mutation CreateCuisines($objects: [master_cuisineName_insert_input!]!) {
      createCuisineName(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_CUISINES = gql`
   mutation DeleteCuisines($ids: [Int!]!) {
      deleteCuisineName(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_ALLERGENS = gql`
   mutation CreateAllergens($objects: [master_allergenName_insert_input!]!) {
      createMasterAllergen(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_ALLERGENS = gql`
   mutation DeleteAllergens($ids: [Int!]!) {
      deleteMasterAllergen(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_UNITS = gql`
   mutation CreateUnits($objects: [unit_unit_insert_input!]!) {
      createUnit(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_UNITS = gql`
   mutation DeleteUnits($ids: [Int!]!) {
      deleteUnit(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`
