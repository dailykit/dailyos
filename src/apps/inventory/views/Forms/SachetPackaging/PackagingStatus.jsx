import React from 'react'
import { ButtonTile, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

import { DataCard } from '../../../components'
import { FlexContainer, Flexible, ShadowCard } from '../styled'
import { ImageContainer } from './styled'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import PackagingInformation from './PackagingInformation'

import { PhotoTunnel } from './Tunnels'

export default function PackagingStats({ state }) {
   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

   return (
      <>
         <Tunnels tunnels={photoTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <PhotoTunnel state={state} close={closePhotoTunnel} />
            </Tunnel>
         </Tunnels>
         <FlexContainer style={{ padding: '0 30px', margin: '0 20px' }}>
            <Flexible width="2">
               {state.images && state.images.length ? (
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
                     <img src={state.images[0].url} alt="processing" />
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
         <PackagingInformation state={state} />
      </>
   )
}
