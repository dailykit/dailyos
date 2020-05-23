import React from 'react'
import { ButtonTile, Text } from '@dailykit/ui'

import { DataCard } from '../../../components'
import { FlexContainer, Flexible, ShadowCard } from '../styled'
import AdditionalInfo from './AdditionalInfo'

export default function PackagingStats({ state, open }) {
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
               <ShadowCard style={{ flexDirection: 'column' }}>
                  <div style={{ margin: '20px 0' }}>
                     <Text as="title">Leak Resistance</Text>
                     <br />
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Leak Resistance"
                        onClick={e => console.log('Tile clicked')}
                        style={{ margin: '20px 0' }}
                     />
                  </div>

                  <div style={{ margin: '20px 0' }}>
                     <Text as="title">Opacity Type</Text>
                     <br />
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Opacity Type"
                        onClick={e => console.log('Tile clicked')}
                        style={{ margin: '20px 0' }}
                     />
                  </div>
                  <div style={{ margin: '20px 0' }}>
                     <Text as="title">Compressable From</Text>
                     <br />
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Compressability"
                        onClick={e => console.log('Tile clicked')}
                        style={{ margin: '20px 0' }}
                     />
                  </div>
               </ShadowCard>
            </Flexible>
         </FlexContainer>
      </>
   )
}
