import React from 'react'
import { TunnelHeader } from '@dailykit/ui'
import { TunnelBody } from '../styled'

const IngredientSachetMatches = ({ close }) => {
   return (
      <>
         <TunnelHeader
            title="Anykit Matches"
            description="Sachets from anykit that matched with this Ingredient Sachet"
            close={() => close(1)}
         />
         <TunnelBody>
            <h3>Hi Anykit!</h3>
         </TunnelBody>
      </>
   )
}

export default IngredientSachetMatches
