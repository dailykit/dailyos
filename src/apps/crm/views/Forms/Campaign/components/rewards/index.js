import React from 'react'
import { ButtonTile } from '@dailykit/ui'

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
      </>
   )
}

export default Rewards
