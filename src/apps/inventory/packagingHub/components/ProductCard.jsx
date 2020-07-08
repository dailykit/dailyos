import React from 'react'

import {
   CardWrapper,
   CardContent,
   CardImage,
   Lead,
   Flexi,
   FlexiSpaced,
   CardData,
   CardPrice,
   ActionButton,
} from './styled'
import { TruckIcon } from '../../assets/icons'

export default function ProductCard({
   product: {
      packagingName,
      packagingCompanyBrand: { name: brandName } = {},
      packagingPurchaseOptions = [],
      assets = {},
   } = {},
}) {
   return (
      <CardWrapper>
         <CardContent>
            <CardImage>
               <img
                  style={{ width: '100%', height: '100%' }}
                  src={assets.images[0].url}
                  alt="product"
               />
            </CardImage>
            <CardData>
               <h1>{packagingName}</h1>
               <Lead>
                  by <span style={{ color: '#00a7e1' }}>{brandName}</span>
               </Lead>

               <Flexi style={{ marginTop: '16px' }}>
                  <div>
                     <TruckIcon />
                  </div>
                  <span style={{ width: '8px' }} />
                  <div>
                     <span>Min Purchase Quantity</span>
                     <p>
                        {packagingPurchaseOptions[0]?.quantity || ''}{' '}
                        {packagingPurchaseOptions[0]?.unit || ''}
                     </p>
                  </div>
               </Flexi>
               {/* <FlexiSpaced>
                  <div>
                     <span>Size</span>
                     <p>2*2 in</p>
                  </div>
                  <div>
                     <span>Thickness</span>
                     <p>3 in</p>
                  </div>
               </FlexiSpaced> */}

               {/* <CardPrice>Price start from $1.2 per item</CardPrice> */}
            </CardData>
         </CardContent>
         <ActionButton>CREATE PURCHASE ORDE</ActionButton>
      </CardWrapper>
   )
}
