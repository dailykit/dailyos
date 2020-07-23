import React from 'react'
import { SearchBox } from '@dailykit/ui'

import { Section, SectionHeader } from './styled'

export default function Sizes() {
   return (
      <Section>
         <SectionHeader>
            <p>Sizes</p>
         </SectionHeader>

         <SearchBox placeholder="Search" value={''} onChange={() => {}} />
      </Section>
   )
}
