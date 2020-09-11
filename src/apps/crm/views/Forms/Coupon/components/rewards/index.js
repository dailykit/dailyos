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
const Rewards = () => {
   return (
      <>
         <ButtonTile
            type="primary"
            size="sm"
            text="Add Rewards"
            // onClick={ e => console.log('Tile clicked') }
            style={{ margin: '20px 0' }}
         />
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <CampaignTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default Rewards
