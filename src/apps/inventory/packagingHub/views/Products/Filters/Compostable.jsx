import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function Compostable() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Compostable
         </Checkbox>
      </Section>
   )
}
