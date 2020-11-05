import {
   ButtonTile,
   Flex,
   Spacer,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { EditIcon } from '../../../../../shared/assets/icons'
import { Ranger } from '../../../../../shared/components/Ranger'
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
            <Flex flex={2}>
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
            <Flex flex={3}>
               <ShadowCard>
                  <RangedStat packaging={state} />
                  <Spacer size="16px" />
                  <Flex container>
                     <DataCard title="Awaiting" quantity={state.awaiting} />
                     <Spacer xAxis size="16px" />
                     <DataCard title="Committed" quantity={state.committed} />
                     <Spacer xAxis size="16px" />
                     <DataCard title="Consumed" quantity={state.consumed} />
                  </Flex>
               </ShadowCard>
            </Flex>
         </Flex>
         <Spacer size="16px" />
         <PackagingInformation state={state} />
      </>
   )
}

function RangedStat({ packaging }) {
   return (
      <Ranger
         label="On hand qty"
         max={packaging.maxLevel}
         min={packaging.parLevel}
         maxLabel="Max Inventory qty"
         minLabel="Par level"
         value={packaging.onHand}
         style={{ marginTop: '72px' }}
      />
   )
}
