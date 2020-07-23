import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function Recyclable() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Recyclable
         </Checkbox>
      </Section>
   )
}
