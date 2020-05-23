import React from 'react'
import { ButtonTile, Text, IconButton } from '@dailykit/ui'

import { DataCard } from '../../../components'
import { FlexContainer, Flexible, ShadowCard } from '../styled'
import AdditionalInfo from './AdditionalInfo'
import EditIcon from '../../../../recipe/assets/icons/Edit'

export default function PackagingStats({ state, open }) {
   const tickGreenSvg = (
      <svg
         width="13"
         height="11"
         viewBox="0 0 13 11"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path
            d="M1 6L4 9L12 1"
            stroke="#28C1F7"
            strokeWidth="2"
            strokeLinecap="round"
         />
      </svg>
   )

   const crossRedSvg = (
      <svg
         width="10"
         height="10"
         viewBox="0 0 10 10"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path
            d="M1 1L9 9"
            stroke="#FF5A52"
            strokeWidth="2"
            strokeLinecap="round"
         />
         <path
            d="M9 1L1 9"
            stroke="#FF5A52"
            strokeWidth="2"
            strokeLinecap="round"
         />
      </svg>
   )

   return (
      <>
         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               <ButtonTile
                  type="primary"
                  size="lg"
                  text="Add a Photo"
                  helper="add some text maybe"
                  onClick={() => {}}
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
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Leak Resistance</Text>
                        {state.leakResistance && (
                           <IconButton type="ghost" onClick={() => open(4)}>
                              <EditIcon />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.leakResistance ? (
                        <div
                           style={{
                              width: '70%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                           }}
                        >
                           <div>
                              {state.leakResistance.liquids ? (
                                 <span style={{ marginRight: '5px' }}>
                                    {tickGreenSvg}
                                 </span>
                              ) : (
                                 <span style={{ marginRight: '5px' }}>
                                    {crossRedSvg}
                                 </span>
                              )}
                              <span>Safe for liquids</span>
                           </div>
                           <div>
                              {state.leakResistance.powderedParticles ? (
                                 <span style={{ marginRight: '5px' }}>
                                    {tickGreenSvg}
                                 </span>
                              ) : (
                                 <span style={{ marginRight: '5px' }}>
                                    {crossRedSvg}
                                 </span>
                              )}
                              <span>Safe for powdered materials</span>
                           </div>
                        </div>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Leak Resistance"
                           onClick={() => open(4)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>

                  <div style={{ margin: '20px 0' }}>
                     <Text as="title">Opacity Type</Text>
                     <br />
                     {state.packOpacity ? (
                        <>
                           <div
                              style={{
                                 width: '70%',
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 margin: '10px 0',
                              }}
                           >
                              <div>
                                 {state.packOpacity.top ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Top</span>
                              </div>
                              <div>
                                 {state.packOpacity.bottom ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Bottom</span>
                              </div>
                           </div>
                           <div
                              style={{
                                 width: '70%',
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 margin: '10px 0',
                              }}
                           >
                              <div>
                                 {state.packOpacity.side1 ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Side 1</span>
                              </div>
                              <div>
                                 {state.packOpacity.side2 ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Side 2</span>
                              </div>
                           </div>
                           <div
                              style={{
                                 width: '70%',
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 margin: '10px 0',
                              }}
                           >
                              <div>
                                 {state.packOpacity.side3 ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Side 3</span>
                              </div>
                              <div>
                                 {state.packOpacity.side4 ? (
                                    <span style={{ marginRight: '5px' }}>
                                       {tickGreenSvg}
                                    </span>
                                 ) : (
                                    <span style={{ marginRight: '5px' }}>
                                       {crossRedSvg}
                                    </span>
                                 )}
                                 <span>Side 4</span>
                              </div>
                           </div>
                        </>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Opacity Type"
                           onClick={() => open(5)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>
                  <div style={{ margin: '20px 0' }}>
                     <Text as="title">Compressable From</Text>
                     <br />
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Compressability"
                        onClick={() => open(6)}
                        style={{ margin: '20px 0' }}
                     />
                  </div>
               </ShadowCard>
            </Flexible>
         </FlexContainer>
      </>
   )
}
