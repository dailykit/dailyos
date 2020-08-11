import React from 'react'
import { Text } from '@dailykit/ui'
import DatePicker from 'react-datepicker'
import { useSubscription } from '@apollo/react-hooks'

import { useMenu } from './state'
import { OCCURRENCES_DATES } from '../../../graphql'

const DateSection = () => {
   const { state, dispatch } = useMenu()
   const { data: { occurrences_dates = [] } = {} } = useSubscription(
      OCCURRENCES_DATES
   )

   const handleDateChange = date => {
      dispatch({ type: 'SET_DATE', payload: date })
   }

   return (
      <aside>
         <Text as="h2">Date</Text>
         <DatePicker
            inline
            selected={state.date}
            onChange={handleDateChange}
            disabledKeyboardNavigation={true}
            includeDates={occurrences_dates.map(node => new Date(node.date))}
         />
      </aside>
   )
}

export default DateSection
