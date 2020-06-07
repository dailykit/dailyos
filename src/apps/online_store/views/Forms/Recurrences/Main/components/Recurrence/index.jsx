import React from 'react'
import { RRule, RRuleSet, rrulestr } from 'rrule'

import { Text, Tag } from '@dailykit/ui'

import { Container } from '../../../styled'

import { TimeSlots } from '../'

const Recurrence = ({ recurrence, index }) => {
   return (
      <>
         <Container bottom="8">
            <Text as="subtitle">Recurrence {index + 1} </Text>
         </Container>
         <Container bottom="32">
            <Tag as="title">{rrulestr(recurrence.rrule).toText()}</Tag>
         </Container>
         <TimeSlots timeSlots={recurrence.timeSlots} />
      </>
   )
}

export default Recurrence
