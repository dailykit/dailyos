import gql from 'graphql-tag'

export const UNIT_CONVERSIONS = {
   LIST: gql`
      subscription UnitConversions {
         unitConversions {
            id
            inputUnitName
            outputUnitName
            conversionFactor
         }
      }
   `,
   CREATE: gql`
      mutation CreateUnitConversions(
         $objects: [master_unitConversion_insert_input!]!
      ) {
         createUnitConversion(objects: $objects) {
            affected_rows
         }
      }
   `,
}

export const UNITS = {
   LIST: gql`
      subscription Units {
         units {
            id
            name
            title: name
         }
      }
   `,
}
