import React from 'react'

import { Text, Tag } from '@dailykit/ui'

import { Container } from '../../../styled'

import { TimeSlots } from '../'

const Recurrence = () => {
   const timeSlots = [
      {
         id: 1,
         from: '09:00:00+00',
         to: '19:00:00+00',
         mileRanges: [
            {
               id: 1,
               from: 0,
               to: 3,
               leadTime: null,
               prepTime: 30,
               charges: [
                  {
                     id: 1,
                     orderValueFrom: 0,
                     orderValueUpto: 25,
                     charge: 5,
                  },
               ],
            },
         ],
      },
   ]

   return (
      <>
         <Container bottom="8">
            <Text as="subtitle">Recurrence 1</Text>
         </Container>
         <Container bottom="32">
            <Tag as="title">Every Monday and Tuesday</Tag>
         </Container>
         <TimeSlots timeSlots={timeSlots} />
      </>
   )
}

export default Recurrence
