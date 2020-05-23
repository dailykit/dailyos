import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { DataCard } from '../../../components'
import { FlexContainer, Flexible, ShadowCard } from '../styled'
import AdditionalInfo from './AdditionalInfo'

export default function PackagingStats({ state }) {
   return (
      <>
         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               <ButtonTile
                  type="primary"
                  size="lg"
                  text="Add a Photo"
                  helper="add some text maybe"
                  onClick={e => console.log('Tile clicked')}
               />
            </Flexible>
            <span style={{ width: '20px' }} />
            <Flexible width="3">
               <ShadowCard>
                  <DataCard title="Par Level" quantity={state.parLevel} />
                  <DataCard title="Max. Level" quantity={state.maxLevel} />
                  <DataCard title="On Hand" quantity={state.onHand} />
                  <DataCard title="Awaiting" quantity={state.awaiting} />

                  <DataCard title="Committed" quantity={state.committed} />

                  <DataCard title="Consumed" quantity={state.consumed} />
               </ShadowCard>
            </Flexible>
         </FlexContainer>
         <br />
         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               <AdditionalInfo state={state} />
            </Flexible>
            <span style={{ width: '20px' }} />
            <Flexible width="3">
               <ShadowCard>
                  <DataCard title="Par Level" quantity={state.parLevel} />
                  <DataCard title="Max. Level" quantity={state.maxLevel} />
                  <DataCard title="On Hand" quantity={state.onHand} />
                  <DataCard title="Awaiting" quantity={state.awaiting} />

                  <DataCard title="Committed" quantity={state.committed} />

                  <DataCard title="Consumed" quantity={state.consumed} />
               </ShadowCard>
            </Flexible>
         </FlexContainer>
      </>
   )
}
