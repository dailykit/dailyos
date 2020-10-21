import {
   ButtonTile,
   Flex,
   Spacer,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import { DataCard } from '../../../components'
import { ShadowCard } from '../styled'
import PackagingInformation from './PackagingInformation'
import { ImageContainer } from './styled'
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
         <Flex container>
            <Flex style={{ flex: 2 }}>
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
            </Flex>
            <Spacer xAxis size="16px" />
            <Flex style={{ flex: 3 }}>
               <ShadowCard>
                  <DataCard title="Par Level" quantity={state.parLevel} />
                  <DataCard title="Max. Level" quantity={state.maxLevel} />
                  <DataCard title="On Hand" quantity={state.onHand} />
                  <DataCard title="Awaiting" quantity={state.awaiting} />

                  <DataCard title="Committed" quantity={state.committed} />

                  <DataCard title="Consumed" quantity={state.consumed} />
               </ShadowCard>
            </Flex>
         </Flex>
         <Spacer size="16px" />
         <PackagingInformation state={state} />
      </>
   )
}
