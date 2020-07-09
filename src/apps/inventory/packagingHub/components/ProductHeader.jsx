import React from 'react'
import styled from 'styled-components'
import { TextButton } from '@dailykit/ui'

import { TruckIcon } from '../../assets/icons'
import { FlexContainer } from '../../views/Forms/styled'

export default function ProductHeader({ product }) {
   const {
      packagingName,
      packagingCompanyBrand: { name: brandName },
      packagingPurchaseOptions,
   } = product

   return (
      <Wrapper>
         <h2>{packagingName}</h2>

         <FlexContainer
            style={{ justifyContent: 'space-between', marginTop: '12px' }}
         >
            <Section>
               <Lead>
                  by <b style={{ color: '#00A7E1' }}>{brandName}</b>
               </Lead>

               <FlexContainer style={{ alignItems: 'center' }}>
                  <TruckIcon />
                  <div style={{ marginLeft: '8px' }}>
                     <Lead style={{ fontSize: '10px', margin: '0 0 4px 0' }}>
                        Min Purchase Quantity
                     </Lead>
                     <Lead style={{ margin: '0' }}>
                        {packagingPurchaseOptions[0].quantity}{' '}
                        {packagingPurchaseOptions[0].unit}
                     </Lead>
                  </div>
               </FlexContainer>
            </Section>
            <CTA>
               <TextButton type="solid">CREATE PURCHASE ORDER</TextButton>
            </CTA>
         </FlexContainer>
      </Wrapper>
   )
}

const Wrapper = styled.div`
   h2 {
      font-size: 40px;
      line-height: 38px;
      color: #555b6e;
   }
`

const CTA = styled.div`
   height: 104px;
   width: 40%;
   padding: 28px 36px;
   background: #f3f3f3;

   display: flex;
   align-items: center;
   justify-content: center;
`
const Lead = styled.p`
   color: #555b6e;
   margin: 0 0 24px 0;
   font-size: 16px;
`

const Section = styled.div`
   width: 50%;
   border-bottom: 1px solid #ececec;
`
