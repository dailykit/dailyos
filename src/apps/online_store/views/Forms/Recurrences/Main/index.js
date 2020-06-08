import React from 'react'
import { rrulestr } from 'rrule'
import { Text, ButtonTile } from '@dailykit/ui'
import { Container } from '../styled'
import { TableHeader, TableRecord } from './styled'

import { TimeSlots } from './components'

const Main = ({ recurrences }) => {
   return (
      <Container
         position="fixed"
         height="100vh"
         style={{ overflowY: 'scroll', width: '100%' }}
      >
         <Container
            paddingX="32"
            bg="#fff"
            position="fixed"
            width="100%"
            style={{ zIndex: '10' }}
         >
            <Text as="h1">Recurrences</Text>
         </Container>
         <Container top="80" paddingX="32">
            {Boolean(recurrences?.length) && (
               <>
                  <TableHeader>
                     <span>Recurrences</span>
                     <span>Time Slots</span>
                     <span>Delivery Range</span>
                     <span>Lead Time</span>
                     <span>Order Value</span>
                     <span>Charges</span>
                  </TableHeader>
                  {recurrences.map(recurrence => (
                     <TableRecord key={recurrence.id}>
                        <div style={{ padding: '16px' }}>
                           {rrulestr(recurrence.rrule).toText()}
                        </div>
                        <div>
                           <TimeSlots timeSlots={recurrence.timeSlots} />
                        </div>
                     </TableRecord>
                  ))}
               </>
            )}
            <ButtonTile
               noIcon
               type="secondary"
               text="Add Recurrence"
               onClick={e => console.log('Tile clicked')}
            />
         </Container>
      </Container>
   )
}

export default Main
