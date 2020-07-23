import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function Compressable() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Compressable
         </Checkbox>
      </Section>
   )
}
