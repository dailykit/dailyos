import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import {
   Text,
   ButtonGroup,
   IconButton,
   PlusIcon,
   Toggle,
   Loader,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { RewardsTunnel } from '../../tunnels'
const Rewards = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   return (
      <>
         <ButtonTile
            type="primary"
            size="sm"
            text="Add Rewards"
            onClick={() => openTunnel(1)}
            style={{ margin: '20px 0' }}
         />
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <RewardsTunnel close={closeTunnel} state={state} />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default Rewards
