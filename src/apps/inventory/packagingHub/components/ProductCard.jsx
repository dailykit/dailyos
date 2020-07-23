import React, { useContext } from 'react'

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

import { Context } from '../../context/tabs'

export default function ProductCard({
   product: {
      id,
      packagingName,
      packagingCompanyBrand: { name: brandName } = {},
      length,
      thickness,
      width,
      LWHUnit,
      packagingPurchaseOptions = [],
      assets = {},
   } = {},
}) {
   const { dispatch } = useContext(Context)

   const openProductDetailsView = () => {
      dispatch({
         type: 'ADD_TAB',
         payload: {
            type: 'forms',
            title: packagingName,
            view: 'packagingHubProductDetailsView',
            id,
         },
      })
   }

   return (
      <CardWrapper onClick={openProductDetailsView}>
         <CardContent>
            <CardImage>
               <img
                  style={{ width: '100%', height: '100%' }}
                  src={assets?.images[0]?.url}
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
               <FlexiSpaced>
                  <div>
                     <span>Size</span>
                     <p>
                        {length}*{width} {LWHUnit}
                     </p>
                  </div>
                  <div>
                     <span>Thickness</span>
                     <p>
                        {thickness} {LWHUnit}
                     </p>
                  </div>
               </FlexiSpaced>

               <CardPrice>
                  Price start from $
                  {packagingPurchaseOptions[0]?.salesPrice || 'N/a'}
               </CardPrice>
            </CardData>
         </CardContent>
         <ActionButton>CREATE PURCHASE ORDE</ActionButton>
      </CardWrapper>
   )
}
