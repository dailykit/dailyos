import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

export default function WaterResistance() {
   return (
      <Section>
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Water Resistant
         </Checkbox>
         <br />
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Inner Water Resistant
         </Checkbox>
         <br />
         <Checkbox id="label" checked={false} onChange={() => {}}>
            Outer Water Resistant
         </Checkbox>
      </Section>
   )
}
