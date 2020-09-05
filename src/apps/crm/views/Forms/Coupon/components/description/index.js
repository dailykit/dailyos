import React from 'react'
import { ButtonTile } from '@dailykit/ui'

const Description = () => {
   return (
      <>
         <ButtonTile
            type="primary"
            size="sm"
            text="Add Description"
            // onClick={ e => console.log('Tile clicked') }
            style={{ margin: '20px 0' }}
         />
      </>
   )
}

export default Description
