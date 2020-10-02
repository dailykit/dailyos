const rrule = require('rrule')
const capitalizeString = require('./capitalizeString')

const rRuleDay = customerRRule => {
   const rule = rrule.RRule.fromString(customerRRule)
   const text = rule.toText()
   const day = capitalizeString(text)
   return day
}

export default rRuleDay
