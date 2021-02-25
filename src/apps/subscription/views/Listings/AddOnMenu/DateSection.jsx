import React from 'react'
import { Text, Flex } from '@dailykit/ui'
import DatePicker from 'react-datepicker'
import { useSubscription } from '@apollo/react-hooks'

import { useMenu } from './state'
import { OCCURRENCES_DATES } from '../../../graphql'
import { Tooltip } from '../../../../../shared/components'

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
         <Flex container height="48px" alignItems="center">
            <Text as="h2">Date</Text>
            <Tooltip identifier="listing_menu_section_date_heading" />
         </Flex>
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
