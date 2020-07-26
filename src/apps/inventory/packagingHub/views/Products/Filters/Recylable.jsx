import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'
import { FlexContainer } from '../../../../views/Forms/styled'

export default function Recyclable() {
   return (
      <Section>
         <FlexContainer>
            <Checkbox checked={false} onChange={() => {}} />
            <span style={{ width: '12px' }} />
            <h5>Recyclable</h5>
         </FlexContainer>
      </Section>
   )
}
