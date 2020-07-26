import React from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'
import { FlexContainer } from '../../../../views/Forms/styled'

export default function Compressable() {
   return (
      <Section>
         <FlexContainer>
            <Checkbox checked={false} onChange={() => {}} />
            <span style={{ width: '12px' }} />
            <h5>Compressable</h5>
         </FlexContainer>
      </Section>
   )
}
