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
}
