import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function GreaseResistance() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Grease Resistant
         </Checkbox>
      </Section>
   )
}
