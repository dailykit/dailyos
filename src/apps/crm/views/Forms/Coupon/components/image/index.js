import React from 'react'
import { ButtonTile } from '@dailykit/ui'

const Image = () => {
   return (
      <>
         <ButtonTile
            type="primary"
            size="sm"
            text="Add Image to Coupon"
            helper="upto 1MB - only JPG, PNG, PDF allowed"
            // onClick={ e => console.log('Tile clicked') }
            style={{ margin: '20px 0' }}
         />
      </>
   )
}

export default Image
