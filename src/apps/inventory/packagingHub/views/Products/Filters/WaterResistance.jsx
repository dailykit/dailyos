import React, { useState } from 'react'
import { Checkbox } from '@dailykit/ui'

import { Section } from './styled'

import { FlexContainer } from '../../../../views/Forms/styled'

export default function WaterResistance() {
   const [resistance, setResistance] = useState(false)

   return (
      <Section>
         <FlexContainer>
            <Checkbox checked={resistance} onChange={setResistance} />
            <span style={{ width: '12px' }} />
            <h5>Water Resistant</h5>
         </FlexContainer>

         {resistance ? (
            <>
               <br />
               <FlexContainer style={{ marginLeft: '16px' }}>
                  <Checkbox checked={false} onChange={() => {}} />
                  <span style={{ width: '12px' }} />
                  <h5>Inner Water Resistant</h5>
               </FlexContainer>
               <br />
               <FlexContainer style={{ marginLeft: '16px' }}>
                  <Checkbox checked={false} onChange={() => {}} />
                  <span style={{ width: '12px' }} />
                  <h5>Outer Water Resistant</h5>
               </FlexContainer>
            </>
         ) : null}
      </Section>
   )
}
