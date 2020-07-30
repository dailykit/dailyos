import React from 'react'
import {
   ButtonTile,
   Text,
   IconButton,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'

import { DataCard } from '../../../components'
import { FlexContainer, Flexible, ShadowCard } from '../styled'
import { ImageContainer } from './styled'
import AdditionalInfo from './AdditionalInfo'
import EditIcon from '../../../../recipe/assets/icons/Edit'

import {
   LeakResistanceTunnel,
   OpacityTypeTunnel,
   PackagingTypeTunnel,
   CompressibilityTunnel,
   SealingTypeTunnel,
   PhotoTunnel,
} from './Tunnels'

export default function PackagingStats({ state }) {
   const [leakTunnel, openLeakTunnel, closeLeakTunnel] = useTunnel(1)
   const [opacityTunnel, openOpacityTunnel, closeOpacityTunnel] = useTunnel(1)
   const [
      compressibilityTunnel,
      openCompressibilityTunnel,
      closeCompressibilityTunnel,
   ] = useTunnel(1)
   const [
      packagingTypeTunnel,
      openPackagingTypeTunnel,
      closePackagingTypeTunnel,
   ] = useTunnel(1)
   const [
      sealingTypeTunnel,
      openSealingTypeTunnel,
      closeSealingTypeTunnel,
   ] = useTunnel(1)
   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

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
         <Tunnels tunnels={leakTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <LeakResistanceTunnel state={state} close={closeLeakTunnel} />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={opacityTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <OpacityTypeTunnel state={state} close={closeOpacityTunnel} />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={compressibilityTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <CompressibilityTunnel
                  state={state}
                  close={closeCompressibilityTunnel}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={packagingTypeTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <PackagingTypeTunnel
                  state={state}
                  close={closePackagingTypeTunnel}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={sealingTypeTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SealingTypeTunnel
                  state={state}
                  close={closeSealingTypeTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={photoTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <PhotoTunnel state={state} close={closePhotoTunnel} />
            </Tunnel>
         </Tunnels>
         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               {state.image ? (
                  <ImageContainer>
                     <div>
                        <span
                           role="button"
                           tabIndex="0"
                           onClick={() => openPhotoTunnel(1)}
                           onKeyDown={e =>
                              e.charCode === 13 && openPhotoTunnel(1)
                           }
                        >
                           <EditIcon />
                        </span>
                     </div>
                     <img src={state.image} alt="processing" />
                  </ImageContainer>
               ) : (
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text="Add Packaging Image"
                     onClick={() => openPhotoTunnel(1)}
                  />
               )}
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
               <AdditionalInfo id={state.id} />
            </Flexible>
            <span style={{ width: '20px' }} />
            <Flexible width="3">
               <ShadowCard style={{ flexDirection: 'column' }}>
                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Packaging type</Text>
                        {state.packagingType && (
                           <IconButton
                              type="ghost"
                              onClick={() => openPackagingTypeTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.packagingType ? (
                        <div
                           style={{
                              width: '70%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                           }}
                        >
                           <div
                              style={{
                                 padding: '10px 80px',
                                 backgroundColor: '#ededed',
                                 borderRadius: '5px',
                              }}
                           >
                              {state.packagingType}
                           </div>
                        </div>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Packaging Material"
                           onClick={() => openPackagingTypeTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>

                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Sealing type</Text>
                        {state.sealingType && (
                           <IconButton
                              type="ghost"
                              onClick={() => openSealingTypeTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.sealingType ? (
                        <div
                           style={{
                              width: '70%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                           }}
                        >
                           <div
                              style={{
                                 padding: '10px 80px',
                                 backgroundColor: '#ededed',
                                 borderRadius: '5px',
                              }}
                           >
                              {state.sealingType}
                           </div>
                        </div>
                     ) : (
                        <ButtonTile
                           noIcon
                           type="secondary"
                           text="Select Sealing type"
                           onClick={() => openSealingTypeTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>

                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Leak Resistance</Text>
                        {state.leakResistance && (
                           <IconButton
                              type="ghost"
                              onClick={() => openLeakTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
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
                           onClick={() => openLeakTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>

                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Opacity Type</Text>
                        {state.packOpacity && (
                           <IconButton
                              type="ghost"
                              onClick={() => openOpacityTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
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
                           onClick={() => openOpacityTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>
                  <div style={{ margin: '20px 0' }}>
                     <FlexContainer style={{ alignItems: 'center' }}>
                        <Text as="title">Compressable From</Text>

                        {state.compressableFrom && (
                           <IconButton
                              type="ghost"
                              onClick={() => openCompressibilityTunnel(1)}
                           >
                              <EditIcon color="#555B6E" />
                           </IconButton>
                        )}
                     </FlexContainer>
                     <br />
                     {state.compressableFrom ? (
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
                                 {state.compressableFrom.top ? (
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
                                 {state.compressableFrom.bottom ? (
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
                                 {state.compressableFrom.side1 ? (
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
                                 {state.compressableFrom.side2 ? (
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
                                 {state.compressableFrom.side3 ? (
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
                                 {state.compressableFrom.side4 ? (
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
                           text="Select Compressability"
                           onClick={() => openCompressibilityTunnel(1)}
                           style={{ margin: '20px 0' }}
                        />
                     )}
                  </div>
               </ShadowCard>
            </Flexible>
         </FlexContainer>
      </>
   )
}
