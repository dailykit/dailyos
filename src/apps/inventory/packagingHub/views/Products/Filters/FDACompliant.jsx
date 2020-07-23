import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function FDACompliant() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            FDA Complaint
         </Checkbox>
      </Section>
   )
}
