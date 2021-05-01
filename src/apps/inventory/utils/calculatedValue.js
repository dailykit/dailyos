export const getCalculatedValue = (sourceUnit, targetUnit, conversions) => {
   try {
      let allConversions = []

      const directCustomConversions = conversions.custom
      const directStandardConversions = conversions.standard
      const otherCustomConversions = conversions.others?.custom
      const otherStandardConversions = conversions.others?.standard

      if (directCustomConversions) {
         allConversions = [
            ...allConversions,
            ...Object.values(directCustomConversions),
         ]
      }
      if (directStandardConversions) {
         allConversions = [
            ...allConversions,
            ...Object.values(directStandardConversions),
         ]
      }
      if (otherCustomConversions) {
         allConversions = [
            ...allConversions,
            ...Object.values(otherCustomConversions),
         ]
      }
      if (otherStandardConversions) {
         allConversions = [
            ...allConversions,
            ...Object.values(otherStandardConversions),
         ]
      }

      console.log(sourceUnit, targetUnit)
      console.log(allConversions)

      const result = allConversions.find(
         ({ toUnitName, fromUnitName }) =>
            toUnitName === targetUnit && fromUnitName === sourceUnit
      )

      if (result) {
         return { error: null, value: result.equivalentValue }
      }

      return { error: 'Not found!', value: null }
   } catch (error) {
      return { error: error.message, value: null }
   }
}
